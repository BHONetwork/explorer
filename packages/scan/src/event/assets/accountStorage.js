const { findBlockApi } = require("../../spec/blockApi");

async function getAssetsAccount(blockHash, assetId, address) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.tokens.account(assetId, address);
  return raw.toJSON();
}

module.exports = {
  getAssetsAccount,
};
