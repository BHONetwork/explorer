export const nodes = [
  {
    name: "Westmint",
    sub: "Westend",
    value: "westmint",
    symbol: "WND",
    icon: "/imgs/icons/westend.svg",
  },
  {
    name: "Statemine",
    sub: "Kusama",
    value: "statemine",
    symbol: "KSM",
    icon: "/imgs/icons/kusama.svg",
  },
];

export const blocksLatestHead = [
  { name: "Height", width: 136 },
  { name: "Time" },
  { name: "Extrinsics", align: "right", width: 136 },
  { name: "Events", align: "right", width: 136 },
];

export const transfersLatestHead = [
  { name: "Extrinsic ID", width: 136 },
  { name: "From", width: 136 },
  { name: "To", width: 136 },
  { name: "Quantity", align: "right" },
];

export const assetsHead = [
  { name: "Asset ID", width: 136 },
  { name: "Symbol", width: 152 },
  { name: "Name", width: 200 },
  { name: "Owner", width: 152 },
  { name: "Issuer", width: 152 },
  { name: "Holders", width: 152 },
  { name: "Total Supply", align: "right" },
];

export const addressExtrincsHead = [
  { name: "ID", width: 160 },
  { name: "Hash" },
  { name: "Time", type: "time", width: 200 },
  { name: "Result", width: 160 },
  { name: "Action", width: 320 },
  { name: "Data", type: "data", width: 76, display: "table" },
];

export const addressAssetsHead = [
  { name: "Asset ID", width: 136 },
  { name: "Symbol", width: 152 },
  { name: "Name", width: 200 },
  { name: "Balance" },
  { name: "Approved" },
  { name: "Frozen" },
  { name: "Transfer Count" },
];

export const addressTransfersHead = [
  { name: "Event ID", width: 136 },
  { name: "Extrinsic ID", width: 136 },
  { name: "Method", width: 200 },
  { name: "Age", type: "time", width: 200 },
  { name: "From", width: 160 },
  { name: "To", width: 160 },
  { name: "Quantity", align: "right" },
];

export const extrinsicEventsHead = [
  { name: "Event ID", width: 160 },
  { name: "Action" },
  { name: "Data", type: "data", align: "right", width: 76, display: "table" },
];

export const blockExtrinsicsHead = [
  { name: "ID", width: 160 },
  { name: "Hash" },
  { name: "Result", width: 160 },
  { name: "Action", width: 320 },
  { name: "Data", type: "data", align: "right", width: 76, display: "table" },
];

export const blockEventsHead = [
  { name: "Event ID", width: 160 },
  { name: "Extrinsic ID", width: 160 },
  { name: "Action" },
  { name: "Data", type: "data", align: "right", width: 76, display: "table" },
];

export const assetTransfersHead = [
  { name: "Event ID", width: 136 },
  { name: "Extrinsic ID", width: 136 },
  { name: "Method", width: 200 },
  { name: "Age", type: "time", width: 200 },
  { name: "From", width: 160 },
  { name: "To", width: 160 },
  { name: "Quantity", align: "right" },
];

export const assetHoldersHead = [
  { name: "Rank", width: 96 },
  { name: "Address" },
  { name: "Quantity", align: "right" },
];

export const blocksHead = [
  { name: "Height", width: 136 },
  { name: "Time", type: "time", width: 200 },
  { name: "Status", width: 160 },
  { name: "Hash", width: 280 },
  { name: "Validator", width: 152 },
  { name: "Extrinsics", align: "right" },
  { name: "Events", align: "right" },
];

export const extrinsicsHead = [
  { name: "Extrinsics ID", width: 136 },
  { name: "Height", width: 136 },
  { name: "Time", type: "time", width: 200 },
  { name: "Extrinsics Hash" },
  { name: "Result", width: 160 },
  { name: "Action", width: 240 },
  { name: "Data", type: "data", align: "right", width: 76, display: "table" },
];

export const eventsHead = [
  { name: "Event ID", width: 160 },
  { name: "Height", width: 160 },
  { name: "Time", type: "time", width: 200 },
  { name: "Extrinsics Hash" },
  { name: "Action" },
  { name: "Data", type: "data", align: "right", width: 76, display: "table" },
];

export const transfersHead = [
  { name: "Event ID", width: 136 },
  { name: "Block", width: 136 },
  { name: "Method", width: 200 },
  { name: "Time", type: "time", width: 200 },
  { name: "From", width: 160 },
  { name: "to", width: 160 },
  { name: "Value", align: "right" },
];

export const addressesHead = [
  { name: "Rank", width: 96 },
  { name: "Address" },
  { name: "Loacked", width: 240, align: "right" },
  { name: "Balance", width: 240, align: "right" },
];

export const addressHead = [
  "Address",
  "Balance",
  "Reserved",
  "Locked",
  "Nonce",
];

export const extrinsicHead = [
  "Timestamp",
  "Block",
  "Life Time",
  "Extrinsic Hash",
  "Module",
  "Call",
  "Tokens Transferred",
  "Nonce",
  "Result",
];

export const blockHead = [
  "Block Time",
  "Status",
  "Hash",
  "Parent Hash",
  "State Root",
  "Extrinsics Root",
  "Validator",
];

export const assetHead = [
  "Symbol",
  "Name",
  "Asset ID",
  "Owner",
  "Issuer",
  "Total Supply",
  "Decimals",
  "Holders",
  "Transfers",
];

export const timeTypes = {
  age: "age",
  date: "date",
};

export const EmptyQuery = {
  total: 0,
  page: 1,
  pageSize: 10,
  items: [],
};