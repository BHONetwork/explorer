const { hexToString } = require("@polkadot/util");
const {
  getNFTClassCollection,
  getNFTTokenCollection,
  getNFTDataCollection,
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

  // Query and populate IPFS media data to token attributes
  const mediaCol = await getNFTDataCollection();
  const mediaData = await mediaCol.findOne({
    metadata_ipfs: tokenDetails.metadata,
  });
  if (mediaData) {
    tokenDetails.data.attributes.media_type = mediaData.file_type;
    tokenDetails.data.attributes.media_uri = mediaData.file_cloud;
  }

  console.log("Token details: " + JSON.stringify(tokenDetails));

  // Insert into DB
  const session = asyncLocalStorage.getStore();
  const col = await getNFTTokenCollection();
  for (let i = 0; i < quantity; i++) {
    const result = await col.updateOne(
      {
        classId: classId,
        tokenId: Number(startTokenId) + i,
        minter: from,
        groupId: groupId,
        destroyedAt: null,
      },
      {
        $setOnInsert: {
          createdAt: blockIndexer,
        },
        $set: {
          ...tokenDetails,
        },
      },
      { upsert: true, session }
    );
  }
}

function isNFTsEvent(section) {
  return section === Modules.NFT;
}

async function handleNFTsEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isNFTsEvent(section)) {
    return false;
  }
  const eventData = data.toJSON();
  console.log("NFT event data:" + JSON.stringify(eventData));
  // Save NFT class
  if ([NFTEvents.ClassCreated].includes(method)) {
    const [owner, class_id] = eventData;
    await updateOrCreateNFTClass(blockIndexer, class_id);
  }

  // Save NFT token
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
  }
  return true;
}

module.exports = {
  handleNFTsEvent,
};
