const { hexToString } = require("@polkadot/util");
const {
  getNFTClassCollection,
  getNFTTokenCollection,
  getNFTDataCollection,
  getNFTGroupOwnerCollection,
  getNftTransferCollection,
} = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { getNFTClass, getToken } = require("./nftStorage");
const { Modules, NFTEvents } = require("../../utils/constants");

async function updateOrCreateNFTClass(blockIndexer, classId) {
  const nftClass = await getNFTClass(blockIndexer.blockHash, classId);

  // Convert class attributes from hex to string
  const convertedAttr = {};
  for (const [key, value] of Object.entries(nftClass.data.attributes)) {
    convertedAttr[hexToString(key)] = hexToString(value);
  }
  nftClass.data.attributes = convertedAttr;
  console.log("NFT class: " + JSON.stringify(nftClass));

  const session = asyncLocalStorage.getStore();
  const col = await getNFTClassCollection();
  const result = await col.updateOne(
    { classId: classId, destroyedAt: null },
    {
      $setOnInsert: {
        createdAt: blockIndexer,
      },
      $set: {
        ...nftClass,
      },
    },
    { upsert: true, session }
  );
}

async function updateOrCreateNFTTokens(
  blockIndexer,
  from,
  to,
  groupId,
  classId,
  startTokenId,
  quantity
) {
  // Get token details
  const tokenDetails = await getToken(
    blockIndexer.blockHash,
    classId,
    startTokenId
  );

  const convertedAttr = {};
  for (const [key, value] of Object.entries(tokenDetails.data.attributes)) {
    convertedAttr[hexToString(key)] = hexToString(value);
  }

  tokenDetails.data.attributes = convertedAttr;
  tokenDetails.metadata = hexToString(tokenDetails.metadata);

  // Insert into DB
  const session = asyncLocalStorage.getStore();

  // Query and populate IPFS media data to token attributes
  const mediaCol = await getNFTDataCollection();
  const mediaData = await mediaCol.findOne(
    {
      metadata_ipfs: tokenDetails.metadata,
    },
    { session }
  );
  if (mediaData) {
    tokenDetails.data.attributes.media_type = mediaData.file_type;
    tokenDetails.data.attributes.media_uri = mediaData.file_cloud;
  }
  console.log("Token details: " + JSON.stringify(tokenDetails));

  // Insert NFT token
  const newIds = [];
  const nftTokenCol = await getNFTTokenCollection();
  for (let i = 0; i < quantity; i++) {
    const tokenId = Number(startTokenId) + i;
    newIds.push(tokenId);
    const result = await nftTokenCol.updateOne(
      {
        classId: classId,
        tokenId: tokenId,
        groupId: groupId,
      },
      {
        $setOnInsert: {
          createdAt: blockIndexer,
        },
        $set: {
          ...tokenDetails,
          destroyedAt: null,
          minter: from,
        },
      },
      { upsert: true, session }
    );
  }

  // Update group ownership
  const nftGroupOwnerCol = await getNFTGroupOwnerCollection();

  await nftGroupOwnerCol.updateOne(
    {
      classId: classId,
      groupId: groupId,
    },
    {
      $setOnInsert: {
        createdAt: blockIndexer,
      },
      $set: {
        ...tokenDetails,
        destroyedAt: null,
        minter: from,
        tokenIds: newIds,
      },
    },
    { upsert: true, session }
  );
}

async function transferNFTToken(
  blockIndexer,
  from,
  to,
  classId,
  tokenId,
  eventSort,
  extrinsicIndex,
  extrinsicHash
) {
  const session = asyncLocalStorage.getStore();
  const tokenCol = await getNFTTokenCollection();
  const nftToken = await tokenCol.findOne({ tokenId, classId }, { session });
  console.log("NFT token:" + JSON.stringify(nftToken));
  await tokenCol.updateOne(
    { tokenId, classId },
    {
      $set: {
        owner: to,
      },
    },
    { session }
  );

  // Update sender token group
  const groupOwnerCol = await getNFTGroupOwnerCollection();

  const senderGroup = await groupOwnerCol.findOne(
    {
      groupId: nftToken.groupId,
      owner: from,
    },
    { session }
  );
  console.log("NFT sender group:" + JSON.stringify(senderGroup));

  const senderGroupData = Object.assign(senderGroup, {});
  console.log(JSON.stringify(senderGroupData));
  const newSenderIds = senderGroup.tokenIds.filter((item) => item !== tokenId);
  if (newSenderIds.length > 0) {
    await groupOwnerCol.updateOne(
      {
        groupId: nftToken.groupId,
        owner: from,
      },
      {
        $set: {
          tokenIds: newSenderIds,
        },
      },
      { session }
    );
  } else {
    await groupOwnerCol.deleteOne(
      {
        groupId: nftToken.groupId,
        owner: from,
      },
      { session }
    );
  }

  // Update receiver
  const receiverGroup = await groupOwnerCol.findOne(
    {
      groupId: nftToken.groupId,
      owner: to,
    },
    { session }
  );

  if (receiverGroup) {
    console.log(
      "Current receiver ids:" + JSON.stringify(receiverGroup.tokenIds)
    );
    receiverGroup.tokenIds.push(tokenId);
    console.log("New receiver ids:" + JSON.stringify(receiverGroup.tokenIds));
    await groupOwnerCol.updateOne(
      {
        groupId: nftToken.groupId,
        owner: to,
      },
      {
        $set: {
          tokenIds: receiverGroup.tokenIds,
        },
      },
      { session }
    );
  } else {
    const receiverGroupData = Object.assign(senderGroupData, {});
    delete receiverGroupData._id;
    receiverGroupData.owner = to;
    receiverGroupData.tokenIds = [tokenId];
    await groupOwnerCol.updateOne(
      {
        groupId: nftToken.groupId,
        owner: to,
      },
      {
        $set: {
          ...receiverGroupData,
        },
      },
      { upsert: true, session }
    );
  }

  // Insert new nftTransfer
  const nftTransferCol = await getNftTransferCollection();
  await nftTransferCol.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      classId,
      groupId: nftToken.groupId,
      tokenId,
      from,
      to,
    },
    { session }
  );
}

async function burnNFTToken(
  blockIndexer,
  owner,
  classId,
  tokenId,
  eventSort,
  extrinsicIndex,
  extrinsicHash
) {
  const session = asyncLocalStorage.getStore();
  const tokenCol = await getNFTTokenCollection();
  const nftToken = await tokenCol.findOne({ tokenId, classId }, { session });
  console.log("NFT token:" + JSON.stringify(nftToken));
  // Update token status
  await tokenCol.updateOne(
    { tokenId, classId },
    {
      $set: {
        destroyedAt: blockIndexer,
        status: "destroyed",
      },
    },
    { session }
  );

  // Update sender token group
  const groupOwnerCol = await getNFTGroupOwnerCollection();

  const senderGroup = await groupOwnerCol.findOne(
    {
      groupId: nftToken.groupId,
      owner: owner,
    },
    { session }
  );
  console.log("NFT owner group:" + JSON.stringify(senderGroup));

  const senderGroupData = Object.assign(senderGroup, {});
  const newSenderIds = senderGroup.tokenIds.filter((item) => item !== tokenId);
  if (newSenderIds.length > 0) {
    await groupOwnerCol.updateOne(
      {
        groupId: nftToken.groupId,
        owner: owner,
      },
      {
        $set: {
          tokenIds: newSenderIds,
        },
      },
      { session }
    );
  } else {
    await groupOwnerCol.deleteOne(
      {
        groupId: nftToken.groupId,
        owner: owner,
      },
      { session }
    );
  }
}

function isNFTsEvent(section) {
  return section === Modules.NFT;
}

async function handleNFTsEvent(eventInput) {
  const { event, eventSort, extrinsicIndex, extrinsicHash, blockIndexer } =
    eventInput;

  const { section, method, data } = event;

  if (!isNFTsEvent(section)) {
    return false;
  }
  console.log("Handling NFT event:" + JSON.stringify(event));

  const eventData = data.toJSON();
  console.log("NFT event data:" + JSON.stringify(eventData));
  // Save NFT class
  if ([NFTEvents.ClassCreated].includes(method)) {
    const [owner, class_id] = eventData;
    await updateOrCreateNFTClass(blockIndexer, class_id);
  }

  // New NFT minted
  if ([NFTEvents.TokenMinted].includes(method)) {
    const [from, to, group_id, class_id, token_id, quantity] = eventData;
    await updateOrCreateNFTTokens(
      blockIndexer,
      from,
      to,
      group_id,
      class_id,
      token_id,
      quantity
    );
    await updateOrCreateNFTClass(blockIndexer, class_id);
  }

  // NFT transfer
  if ([NFTEvents.TransferredToken].includes(method)) {
    console.log("NFT transferred:" + JSON.stringify(eventData));
    const [from, to, class_id, token_id] = eventData;
    await transferNFTToken(
      blockIndexer,
      from,
      to,
      class_id,
      token_id,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
  }

  // NFT burned
  if ([NFTEvents.BurnedToken].includes(method)) {
    console.log("NFT burned:" + JSON.stringify(eventData));
    const [owner, class_id, token_id] = eventData;
    await burnNFTToken(
      blockIndexer,
      owner,
      class_id,
      token_id,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
    await updateOrCreateNFTClass(blockIndexer, class_id);
  }
  return true;
}

module.exports = {
  handleNFTsEvent,
};
