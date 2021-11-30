const { BalancesEvents } = require("../../utils/constants");
const { isBalancesEvent } = require("./utils");
const { addNativeTransfer } = require("../../store/blockNativeTokenTransfers");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");
const { toDecimal128 } = require("../../utils");

async function handleBalancesEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isBalancesEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([BalancesEvents.Transfer].includes(method)) {
    console.log("Handling transfer event:" + JSON.stringify(event));

    const [from, to, value] = eventData;
    addAddresses(blockIndexer.blockHeight, [from, to]);
    addNativeTransfer(blockIndexer.blockHeight, {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      from,
      to,
      balance: toDecimal128(value),
      listIgnore: false,
    });
  }

  if ([BalancesEvents.ReserveRepatriated].includes(method)) {
    const [from, to, balance] = eventData;
    addAddresses(blockIndexer.blockHeight, [from, to]);
  }

  if (
    [
      BalancesEvents.Reserved,
      BalancesEvents.Unreserved,
      BalancesEvents.BalanceSet,
    ].includes(method)
  ) {
    const [address] = eventData;
    addAddress(blockIndexer.blockHeight, address);
  }
}

module.exports = {
  handleBalancesEvent,
};
