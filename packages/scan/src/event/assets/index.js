const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
} = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { getAssetsAccount } = require("./accountStorage");
const { getAssetsApprovals } = require("./approvals");
const { getAssetsMetadata } = require("./metadata");
const { getAssetsAsset } = require("./assetStorage");
const { Modules, AssetsEvents } = require("../../utils/constants");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");
const { toDecimal128 } = require("../../utils");

async function saveNewAssetTransfer(
  blockIndexer,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  assetId,
  from,
  to,
  balance
) {
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId: parseAssetId(assetId), destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetTransferCollection();
  const result = await col.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      asset: asset._id,
      from: from.toString(),
      to: to.toString(),
      balance: toDecimal128(balance),
      listIgnore: false,
      type: "digital_asset",
    },
    { session }
  );
}

async function updateOrCreateAsset(blockIndexer, assetId) {
  console.log("updateOrCreateAsset:" + JSON.stringify(assetId));
  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();

  const result = await col.updateOne(
    { assetId: parseAssetId(assetId), destroyedAt: null },
    {
      $setOnInsert: {
        createdAt: blockIndexer,
      },
      $set: {
        ...metadata,
        ...asset,
        supply: toDecimal128(asset.supply),
        minBalance: toDecimal128(asset.minBalance),
        symbol: hexToString(metadata.symbol),
        name: hexToString(metadata.name),
        isFrozen: asset.isFrozen,
        status: asset.isFrozen ? "frozen" : "active",
      },
    },
    { upsert: true, session }
  );
}

async function saveAssetTimeline(
  blockIndexer,
  assetId,
  section,
  method,
  eventData,
  eventSort,
  extrinsicIndex,
  extrinsicHash
) {
  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId: parseAssetId(assetId), destroyedAt: null },
    {
      $push: {
        timeline: {
          type: "event",
          section,
          method,
          eventData: eventData,
          eventIndexer: blockIndexer,
          eventSort,
          extrinsicIndex,
          extrinsicHash,
          asset: {
            ...asset,
            ...metadata,
            symbol: hexToString(metadata.symbol),
            name: hexToString(metadata.name),
          },
        },
      },
    },
    { session }
  );
}

async function destroyAsset(blockIndexer, assetId) {
  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const asset = await col.findOne(
    { assetId: parseAssetId(assetId) },
    { session }
  );
  if (!asset) {
    return;
  }

  const result = await col.updateOne(
    { assetId: parseAssetId(assetId) },
    {
      $set: {
        destroyedAt: blockIndexer,
        status: "destroyed",
      },
    },
    { session }
  );

  // Update asset Holder status
  const assetHolderCol = await getAssetHolderCollection();
  await assetHolderCol.updateOne(
    {
      asset: asset._id,
    },
    {
      $set: {
        destroyedAt: blockIndexer,
        status: "destroyed",
      },
    },
    { session }
  );
}

async function updateOrCreateAssetHolder(blockIndexer, assetId, address) {
  const account = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    address
  );
  console.log("Asset account data:" + JSON.stringify(account));
  console.log("Asset id:" + JSON.stringify(assetId));
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId: parseAssetId(assetId), destroyedAt: null },
    { session }
  );
  console.log("Asset:" + JSON.stringify(asset));
  if (!asset) {
    return;
  }

  const col = await getAssetHolderCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      address: address.toString(),
    },
    {
      $set: {
        free: toDecimal128(account.free),
        reserved: toDecimal128(account.reserved),
        isFrozen: account.isFrozen,
        sufficient: account.sufficient,
        extra: account.extra,
        balance: toDecimal128(account.free),
        dead: account.free === 0 ? true : false,
        lastUpdatedAt: blockIndexer,
        status: account.isFrozen ? "frozen" : "active",
      },
    },
    { upsert: true, session }
  );
  console.log("Result:" + JSON.stringify(result));
}

async function updateOrCreateApproval(blockIndexer, assetId, owner, delegate) {
  const approval = await getAssetsApprovals(
    blockIndexer.blockHash,
    assetId,
    owner,
    delegate
  );

  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId: parseAssetId(assetId), destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetApprovalCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      owner,
      delegate,
    },
    {
      $set: {
        ...approval,
        lastUpdatedAt: blockIndexer,
      },
    },
    { upsert: true, session }
  );
}

function isAssetsEvent(section) {
  return section === Modules.Tokens;
}

async function handleAssetsEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isAssetsEvent(section)) {
    return false;
  }

  // Special handling for CreateMinted event which is equivalent to multiple events: Created, MetadataSet and Issued
  const newEvents = [];

  // Regenerate events if it is CreateMinted, otherwise use original event
  if ([AssetsEvents.CreateMinted].includes(method)) {
    const [assetId, admin, owner] = data;
    // Push Created event
    newEvents.push({
      section,
      method: AssetsEvents.Created,
      data: [parseInt(assetId), admin.toString(), owner.toString()],
    });

    // Push MetadataSet event
    const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);
    newEvents.push({
      section,
      method: AssetsEvents.MetadataSet,
      data: [
        parseInt(assetId),
        metadata.name,
        metadata.symbol,
        metadata.decimals,
        metadata.isFrozen,
      ],
    });

    // Push Minted event
    const account = await getAssetsAccount(
      blockIndexer.blockHash,
      assetId,
      owner
    );
    newEvents.push({
      section,
      method: AssetsEvents.Issued,
      data: [parseInt(assetId), owner.toString(), account.free],
    });
  } else {
    newEvents.push(event);
  }

  // Loop through events and handle one by one
  for (const event of newEvents) {
    const { section, method, data } = event;
    const eventData = data;
    // Save assets
    if (
      [
        AssetsEvents.Created,
        AssetsEvents.ForceCreated,
        AssetsEvents.MetadataSet,
        AssetsEvents.Issued,
        AssetsEvents.Burned,
        AssetsEvents.AssetStatusChanged,
        AssetsEvents.TeamChanged,
        AssetsEvents.OwnerChanged,
        AssetsEvents.AssetFrozen,
        AssetsEvents.AssetThawed,
      ].includes(method)
    ) {
      const [assetId] = eventData;
      await updateOrCreateAsset(blockIndexer, assetId);
      await saveAssetTimeline(
        blockIndexer,
        assetId,
        section,
        method,
        eventData,
        eventSort,
        extrinsicIndex,
        extrinsicHash
      );
    }

    if (method === AssetsEvents.Destroyed) {
      const [assetId] = eventData;
      await saveAssetTimeline(
        blockIndexer,
        assetId,
        section,
        method,
        eventData,
        eventSort,
        extrinsicIndex,
        extrinsicHash
      );
      await destroyAsset(blockIndexer, assetId);
    }

    if (method === AssetsEvents.Transferred) {
      console.log("Handling asset transfer event:" + JSON.stringify(event));
      const [assetId] = eventData;
      await updateOrCreateAsset(blockIndexer, assetId);
    }

    // Save transfers
    if (method === AssetsEvents.Transferred) {
      const [assetId, from, to, balance] = eventData;
      await saveNewAssetTransfer(
        blockIndexer,
        eventSort,
        extrinsicIndex,
        extrinsicHash,
        assetId,
        from,
        to,
        balance
      );
    }

    // Save asset holders
    if (
      [
        AssetsEvents.Issued,
        AssetsEvents.Burned,
        AssetsEvents.Frozen,
        AssetsEvents.Thawed,
      ].includes(method)
    ) {
      const [assetId, accountId] = eventData;
      addAddress(blockIndexer.blockHeight, accountId);
      await updateOrCreateAssetHolder(blockIndexer, assetId, accountId);
    }

    if (method === AssetsEvents.Transferred) {
      console.log("Handling asset transfer holders:" + JSON.stringify(event));
      const [assetId, from, to, amount] = eventData;
      addAddresses(blockIndexer.blockHeight, [from, to]);
      await updateOrCreateAssetHolder(blockIndexer, assetId, from);
      await updateOrCreateAssetHolder(blockIndexer, assetId, to);
    }

    if (
      [
        AssetsEvents.ApprovedTransfer,
        AssetsEvents.ApprovalCancelled,
        AssetsEvents.TransferredApproved,
      ].includes(method)
    ) {
      const [assetId, owner, delegate] = eventData;
      await updateOrCreateApproval(blockIndexer, assetId, owner, delegate);
    }
  }

  return true;
}

function parseAssetId(assetId) {
  if (assetId.dexShare !== undefined) {
    return assetId.dexShare[0].token.token.id;
  }
  return parseInt(assetId);
}

module.exports = {
  handleAssetsEvent,
};
