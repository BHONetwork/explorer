const { hexToString } = require("@polkadot/util");
const { getNFTClassCollection, getNFTTokenCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { getNFTClass, getLastTokenInGroup, getToken } = require("./nftStorage");
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
  quantity
) {
  const lastToken = await getLastTokenInGroup(
    blockIndexer.blockHash,
    groupId,
    classId
  );
  const [owner, tokenId] = lastToken;
  console.log("Last tokens: " + JSON.stringify(lastToken));

  // Get token details
  const tokenDetails = await getToken(blockIndexer.blockHash, classId, tokenId);
  const convertedAttr = {};
  for (const [key, value] of Object.entries(tokenDetails.data.attributes)) {
    convertedAttr[hexToString(key)] = hexToString(value);
  }
  tokenDetails.data.attributes = convertedAttr;
  console.log("Token details: " + JSON.stringify(tokenDetails));

  // Insert into DB
  const session = asyncLocalStorage.getStore();
  const col = await getNFTTokenCollection();
  for (let i = quantity; i > 0; i--) {
    const result = await col.updateOne(
      {
        classId: classId,
        tokenId: Number(tokenId) - i,
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
    const [from, to, class_id, group_id, quantity] = eventData;
    await updateOrCreateNFTTokens(
      blockIndexer,
      from,
      to,
      group_id,
      class_id,
      quantity
    );
  }
  return true;
}

module.exports = {
  handleNFTsEvent,
};
