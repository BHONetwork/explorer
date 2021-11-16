const { findBlockApi } = require("../../spec/blockApi");

async function getNFTClass(blockHash, classId) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.bholdusSupportNft.classes(classId);
  return raw.toJSON();
}

/*
This will return the last token in the group
*/
async function getLastTokenInGroup(blockHash, groupId, classId) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.bholdusSupportNft.tokensByGroup(
    groupId,
    classId
  );
  return raw.toJSON();
}

/*
Return token details including attributes
*/
async function getToken(blockHash, classId, tokenId) {
  const blockApi = await findBlockApi(blockHash);
  const raw = await blockApi.query.bholdusSupportNft.tokens(classId, tokenId);
  return raw.toJSON();
}

module.exports = {
  getNFTClass,
  getLastTokenInGroup,
  getToken,
};
