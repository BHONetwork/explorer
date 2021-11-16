const Modules = Object.freeze({
  System: "system",
  Balances: "balances",
  Assets: "assets",
  Tokens: "tokens",
  NFT: "nft",
});

const SystemEvents = Object.freeze({
  NewAccount: "NewAccount",
  KilledAccount: "KilledAccount",
  ExtrinsicSuccess: "ExtrinsicSuccess",
  ExtrinsicFailed: "ExtrinsicFailed",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
  Reserved: "Reserved",
  Unreserved: "Unreserved",
  ReserveRepatriated: "ReserveRepatriated",
  BalanceSet: "BalanceSet",
});

const AssetsEvents = Object.freeze({
  // Asset state
  Created: "Created",
  MetadataSet: "MetadataSet",
  MetadataCleared: "MetadataCleared",
  ForceCreated: "ForceCreated",
  AssetStatusChanged: "AssetStatusChanged",
  TeamChanged: "TeamChanged",
  OwnerChanged: "OwnerChanged",
  AssetFrozen: "AssetFrozen",
  AssetThawed: "AssetThawed",
  Destroyed: "Destroyed",

  // Account
  Transferred: "Transferred",
  Frozen: "Frozen",
  Thawed: "Thawed",
  ApprovedTransfer: "ApprovedTransfer",
  ApprovalCancelled: "ApprovalCancelled",
  TransferredApproved: "TransferredApproved",

  // Asset & Account
  Issued: "Issued",
  Burned: "Burned",
});

const NFTEvents = Object.freeze({
  ClassCreated: "CreatedClass",
  TokenMinted: "MintedToken",
});

module.exports = {
  Modules,
  SystemEvents,
  BalancesEvents,
  AssetsEvents,
  NFTEvents,
};
