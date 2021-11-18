const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_SCAN_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_SCAN_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const assetTransferCollectionName = "assetTransfer";
const assetCollectionName = "asset";
const assetHolderCollectionName = "assetHolder";
const addressCollectionName = "address";
const approvalCollectionName = "approval";
const teleportCollectionMame = "teleport";
const nftClassCollectionName = "nftClass";
const nftTokenCollectionName = "nftToken";
const nftDataCollectionName = "nftData";
const nftGroupOwnerCollectionName = "nftGroupOwner";

// unFinalized collection names
const unFinalizedCollectionName = "unFinalizedBlock";
const unFinalizedExtrinsicCollectionName = "unFinalizedExtrinsic";
const unFinalizedEventCollectionName = "unFinalizedEvent";

// Statistic
const dailyAssetStatisticCollectionName = "dailyAssetStatistic";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_SCAN_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let rawAddressCol = null;
let addressCol = null;
let approvalCol = null;
let teleportCol = null;
let nftClassCol = null;
let nftTokenCol = null;
let nftDataCol = null;
let nftGroupOwnerCol = null;

// unFinalized collections
let unFinalizedBlockCol = null;
let unFinalizedExtrinsicCol = null;
let unFinalizedEventCol = null;

let dailyAssetStatisticCol = null;

async function getCollection(colName) {
  return new Promise((resolve, reject) => {
    db.listCollections({ name: colName }).next(async (err, info) => {
      if (!info) {
        const col = await db.createCollection(colName);
        resolve(col);
      } else if (err) {
        reject(err);
      }

      resolve(db.collection(colName));
    });
  });
}

async function initDb() {
  console.log("Init db");
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName();
  console.log(`Use scan DB name:`, dbName);

  db = client.db(dbName);

  statusCol = await getCollection(statusCollectionName);
  blockCol = await getCollection(blockCollectionName);
  eventCol = await getCollection(eventCollectionName);
  extrinsicCol = await getCollection(extrinsicCollectionName);
  assetTransferCol = await getCollection(assetTransferCollectionName);
  assetCol = await getCollection(assetCollectionName);
  assetHolderCol = await getCollection(assetHolderCollectionName);
  rawAddressCol = await getCollection("rawAddress");
  addressCol = await getCollection(addressCollectionName);
  approvalCol = await getCollection(approvalCollectionName);
  teleportCol = await getCollection(teleportCollectionMame);

  // NFT
  nftClassCol = await getCollection(nftClassCollectionName);
  nftTokenCol = await getCollection(nftTokenCollectionName);
  nftDataCol = await getCollection(nftDataCollectionName);
  nftGroupOwnerCol = await getCollection(nftGroupOwnerCollectionName);

  unFinalizedBlockCol = await getCollection(unFinalizedCollectionName);
  unFinalizedExtrinsicCol = await getCollection(
    unFinalizedExtrinsicCollectionName
  );
  unFinalizedEventCol = await getCollection(unFinalizedEventCollectionName);
  dailyAssetStatisticCol = await getCollection(
    dailyAssetStatisticCollectionName
  );

  console.log("Create indexes");
  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  rawAddressCol.createIndex({ updated: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getDailyAssetStatisticCollection() {
  await tryInit(dailyAssetStatisticCol);
  return dailyAssetStatisticCol;
}

async function getUnFinalizedEventCollection() {
  await tryInit(unFinalizedEventCol);
  return unFinalizedEventCol;
}

async function getUnFinalizedExrinsicCollection() {
  await tryInit(unFinalizedExtrinsicCol);
  return unFinalizedExtrinsicCol;
}

async function getUnFinalizedBlockCollection() {
  await tryInit(unFinalizedBlockCol);
  return unFinalizedBlockCol;
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getBlockCollection() {
  await tryInit(blockCol);
  return blockCol;
}

async function getExtrinsicCollection() {
  await tryInit(extrinsicCol);
  return extrinsicCol;
}

async function getEventCollection() {
  await tryInit(eventCol);
  return eventCol;
}

async function getAssetTransferCollection() {
  await tryInit(assetTransferCol);
  return assetTransferCol;
}

async function getAssetCollection() {
  await tryInit(assetCol);
  return assetCol;
}

async function getAssetHolderCollection() {
  await tryInit(assetHolderCol);
  return assetHolderCol;
}

async function getAddressCollection() {
  await tryInit(addressCol);
  return addressCol;
}

async function getRawAddressCollection() {
  await tryInit(rawAddressCol);
  return rawAddressCol;
}

async function getAssetApprovalCollection() {
  await tryInit(approvalCol);
  return approvalCol;
}

async function getTeleportCollection() {
  await tryInit(teleportCol);
  return teleportCol;
}

function withSession(fn) {
  return client.withSession(fn);
}

// NFT
async function getNFTClassCollection() {
  await tryInit(nftClassCol);
  return nftClassCol;
}

async function getNFTTokenCollection() {
  await tryInit(nftTokenCol);
  return nftTokenCol;
}

async function getNFTDataCollection() {
  await tryInit(nftDataCol);
  return nftDataCol;
}

async function getNFTGroupOwnerCollection() {
  await tryInit(nftGroupOwnerCol);
  return nftGroupOwnerCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getRawAddressCollection,
  getAssetApprovalCollection,
  getTeleportCollection,
  getUnFinalizedBlockCollection,
  getUnFinalizedExrinsicCollection,
  getUnFinalizedEventCollection,
  getDailyAssetStatisticCollection,
  withSession,
  getNFTClassCollection,
  getNFTTokenCollection,
  getNFTDataCollection,
  getNFTGroupOwnerCollection,
};
