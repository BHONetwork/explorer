const BigNumber = require("bignumber.js");
const { getAssetAmount } = require("./amount");
const { extractBeneficiary } = require("./beneficiary");
const { isSupportedDest } = require("./dest");
const { insertTeleport } = require("../../../../mongo/service");
const {
  XcmPalletMethods,
  XcmPalletEvents,
  teleportLogger,
  store: { addAddresses },
} = require("@statescan/common");

async function handleTeleportExtrinsic(extrinsic, indexer, events) {
  const { method } = extrinsic.method;
  if (
    ![
      XcmPalletMethods.limitedTeleportAssets,
      XcmPalletMethods.teleportAssets,
    ].includes(method)
  ) {
    return;
  }

  if (!events.some((e) => XcmPalletEvents.Attempted === e.method)) {
    return;
  }

  const info = extractTeleportInfo(extrinsic, indexer);
  if (!info) {
    teleportLogger.error(`unexpected teleport at`, indexer);
    return;
  }

  const signer = extrinsic.singer.toString();
  const teleport = {
    sentAt: indexer.blockHeight,
    direction: 1,
    signer,
    ...info,
    indexer,
  };

  addAddresses(indexer.blockHeight, [signer, info.beneficiary]);

  await insertTeleport(teleport);
}

function extractTeleportInfo(extrinsic, indexer) {
  const [destArg, beneficiaryArg, assetsArg] = extrinsic.method.args;
  const argsMeta = extrinsic.method.meta.args;

  if (!isSupportedDest(destArg, argsMeta[0], indexer)) {
    return;
  }

  const beneficiary = extractBeneficiary(beneficiaryArg, argsMeta[1], indexer);
  if (!beneficiary) {
    teleportLogger.error(
      `can not extract beneficiary from teleport at`,
      indexer
    );
    return;
  }

  const amount = getAssetAmount(assetsArg, argsMeta[2], indexer);
  if (new BigNumber(amount).isLessThanOrEqualTo(0)) {
    teleportLogger.info(`no fungible at`, indexer);
  }

  return {
    beneficiary,
    amount,
  };
}

module.exports = {
  handleTeleportExtrinsic,
};
