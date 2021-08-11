const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../envvars");

function getDbName() {
  const chain = currentChain();
  if (CHAINS.STATEMINE === chain) {
    return process.env.MONGO_DB_KSM_NAME || "statescan-ksm";
  } else if (CHAINS.WESTMINT === chain) {
    return process.env.MONGO_DB_WND_NAME || "statescan-wnd";
  } else {
    return process.env.MONGO_DB_ROC_NAME || "statescan-roc";
  }
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

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let addressCol = null;
let approvalCol = null;
let teleportCol = null;

async function getCollection(colName) {
  try {
    await db.createCollection(colName);
  } catch (e) {
    // ignore
  }
  return db.collection(colName);
}

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName();
  console.log(`Use scan DB name:`, dbName);

  db = client.db(dbName);

  statusCol = getCollection(statusCollectionName);
  blockCol = getCollection(blockCollectionName);
  eventCol = getCollection(eventCollectionName);
  extrinsicCol = getCollection(extrinsicCollectionName);
  assetTransferCol = getCollection(assetTransferCollectionName);
  assetCol = getCollection(assetCollectionName);
  assetHolderCol = getCollection(assetHolderCollectionName);
  addressCol = getCollection(addressCollectionName);
  approvalCol = getCollection(approvalCollectionName);
  teleportCol = getCollection(teleportCollectionMame);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
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

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getAssetApprovalCollection,
  getTeleportCollection,
  withSession,
};
