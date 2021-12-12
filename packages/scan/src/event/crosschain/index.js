const { getCrosschainTransactionCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { CrossChainTransferType, CrossChainAssetType, CrossChainNetwork, CrossChainTransferStatus } = require("../../utils/constants");
const { toDecimal128 } = require("../../utils");

const Modules = Object.freeze({
  bridgeNativeTransfer: "bridgeNativeTransfer",
});

const bridgeNativeTransferEvents = Object.freeze({
  InboundTokenReleased: "InboundTokenReleased",
  OutboundTransferInitiated: "OutboundTransferInitiated",
});

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

  // Deposit from BSC to BHC
  if ([bridgeNativeTransferEvents.InboundTokenReleased].includes(method)) {
    console.log('Handle crosschain deposit event:'+JSON.stringify(event));
    const [inbound_transfer_id, from, to, amount] = eventData;
    const session = asyncLocalStorage.getStore();
    const col = await getCrosschainTransactionCollection();
    const result = await col.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      transferId: inbound_transfer_id.toString(),
      transferType: CrossChainTransferType.Deposit,
      assetType: CrossChainAssetType.Native,
      network: CrossChainNetwork.BSC,
      assetId: null,
      from: from.toString(),
      to: to.toString(),
      amount: toDecimal128(amount),
      status: CrossChainTransferStatus.Confirmed,
    },
    { session });
  }

  // Withdrawal from BHC to BSC
  if ([bridgeNativeTransferEvents.OutboundTransferInitiated].includes(method)) {
    console.log('Handle crosschain withdrawal event:'+JSON.stringify(event));
    const [outbound_transfer_id, from, to, amount] = eventData;
    const session = asyncLocalStorage.getStore();
    const col = await getCrosschainTransactionCollection();
    const result = await col.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      transferId: outbound_transfer_id.toString(),
      transferType: CrossChainTransferType.Withdrawal,
      assetType: CrossChainAssetType.Native,
      network: CrossChainNetwork.BSC,
      assetId: null,
      from: from.toString(),
      to: to.toString(),
      amount: toDecimal128(amount),
      status: CrossChainTransferStatus.Confirmed,
    },
    { session });
  }

  return true;
}

module.exports = {
  handleCrosschainEvent,
};
