const {
  addNativeTransfer,
} = require("../../../store/blockNativeTokenTransfers");
const { addAddresses } = require("../../../store/blockAddresses");
const { toDecimal128 } = require("../../../utils");

async function handleTransfer(event, eventSort, blockIndexer) {
  const eventData = event.data.toJSON();
  const [from, to, value] = eventData;
  addAddresses(blockIndexer.blockHeight, [from, to]);
  addNativeTransfer(blockIndexer.blockHeight, {
    indexer: blockIndexer,
    eventSort,
    from,
    to,
    balance: toDecimal128(value),
    listIgnore: true,
  });
}

module.exports = {
  handleTransfer,
};
