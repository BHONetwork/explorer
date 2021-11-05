const { findBlockApi } = require("../../spec/blockApi");

async function getAssetsAsset(blockHash, assetId) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.tokens.asset(assetId);
  console.log("Asset data:" + JSON.stringify(raw));
  return raw.toJSON();
}

module.exports = {
  getAssetsAsset,
};
