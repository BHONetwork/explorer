const { findBlockApi } = require("../../spec/blockApi");

async function getAssetsMetadata(blockHash, assetId) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.tokens.metadata(assetId);
  console.log("Asset meta:" + JSON.stringify(raw));
  return raw.toJSON();
}

module.exports = {
  getAssetsMetadata,
};
