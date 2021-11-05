const { findBlockApi } = require("../../spec/blockApi");

async function getAssetsApprovals(blockHash, assetId, owner, delegate) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.tokens.approvals(assetId, owner, delegate);
  return raw.toJSON();
}

module.exports = {
  getAssetsApprovals,
};
