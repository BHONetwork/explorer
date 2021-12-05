const { getCrosschainTransactionCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  bridgeNativeTransfer: "bridgeNativeTransfer",
});

const bridgeNativeTransferEvents = Object.freeze({
  InboundTokenReleased: "InboundTokenReleased",
});

async function updateTeleportCompletion(blockHeight, extrinsicIndex, complete) {
  const session = asyncLocalStorage.getStore();
  const col = await getCrosschainTransactionCollection();
  await col.updateOne(
    { "indexer.blockHeight": blockHeight, "indexer.index": extrinsicIndex },
    {
      $set: {
        complete,
      },
    },
    { session }
  );
}

function isCrosschainEvent(section) {
  return section === Modules.bridgeNativeTransfer;
}

async function handleCrosschainEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isCrosschainEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  // Deposit
  if ([bridgeNativeTransferEvents.InboundTokenReleased].includes(method)) {
    console.log('Handle deposit event');
    // const [result] = eventData;

    // if (result.incomplete) {
    //   await updateTeleportCompletion(
    //     blockIndexer.blockHeight,
    //     extrinsicIndex,
    //     false
    //   );
    // }

    // if (result.complete) {
    //   await updateTeleportCompletion(
    //     blockIndexer.blockHeight,
    //     extrinsicIndex,
    //     true
    //   );
    // }
  }

  return true;
}

module.exports = {
  handleCrosschainEvent,
};
