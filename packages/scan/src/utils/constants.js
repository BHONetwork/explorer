const Modules = Object.freeze({
  System: "system",
  Balances: "balances",
  Assets: "assets",
  Tokens: "tokens",
  NFT: "nft",
  CrossChain: "crosschain",
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
  CreateMinted: "CreateMinted",
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
  TransferredToken: "TransferredToken",
  BurnedToken: "BurnedToken",
});

// Crosschain
const CrossChainEvents = Object.freeze({
  InboundTokenReleased: "InboundTokenReleased",
  OutboundTransferInitiated: "OutboundTransferInitiated",
});

const CrossChainTransferType = Object.freeze({
  Deposit: "deposit",
  Withdrawal: "withdrawal",
});

const CrossChainAssetType = Object.freeze({
  Native: "native",
  DigitalAsset: "digital_asset",
});

const CrossChainNetwork = Object.freeze({
  BSC: "BSC",
});

const CrossChainTransferStatus = Object.freeze({
  Pending: "pending",
  Confirmed: "confirmed",
  Failed: "failed",
});

module.exports = {
  Modules,
  SystemEvents,
  BalancesEvents,
  AssetsEvents,
  NFTEvents,
  CrossChainEvents,
  CrossChainAssetType,
  CrossChainTransferType,
  CrossChainTransferStatus,
  CrossChainNetwork,
};
