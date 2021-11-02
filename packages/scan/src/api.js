const { ApiPromise, WsProvider } = require("@polkadot/api");
let provider = null;
let api = null;

async function getApi() {
  if (!api) {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error("WS_ENDPOINT not set");
    }

    console.log(`Connect to endpoint:`, wsEndpoint);
    provider = new WsProvider(wsEndpoint, 1000);
    const apiOps = {
      CurrencyId: {
        _enum: { Token: "(TokenSymbol)", DexShare: "(DexShare,DexShare)" },
      },
      TokenSymbol: { _enum: { Native: null, Token: "(TokenInfo)" } },
      DexShare: { _enum: { Token: "(TokenSymbol)" } },
      TokenInfo: { id: "u32" },
      CurrencyIdOf: "CurrencyId",
      TradingPair: "(CurrencyId, CurrencyId)",
      ExchangeRate: "FixedU128",
      AssetId: "CurrencyId",
      TAssetBalance: "u128",
      AssetBalance: {
        free: "Balance",
        reserved: "Balance",
        is_frozen: "bool",
        sufficient: "bool",
        extra: "()",
      },
      AssetIdentity: {
        additional: "Vec<(Data, Data)>",
        basic_information: "BasicInformation",
        social_profiles: "SocialProfile",
      },
      BasicInformation: {
        project_name: "Data",
        official_project_website: "Data",
        official_email_address: "Data",
        logo_icon: "Data",
        project_sector: "Data",
        project_description: "Data",
      },
      SocialProfile: {
        whitepaper: "Data",
        medium: "Data",
        github: "Data",
        reddit: "Data",
        telegram: "Data",
        discord: "Data",
        slack: "Data",
        facebook: "Data",
        linkedin: "Data",
        twitter: "Data",
      },
      Approval: { amount: "Balance", deposit: "Balance" },
      TradingPairStatus: {
        _enum: {
          Disabled: null,
          Enabled: null,
          Provisioning: "(ProvisioningParameters)",
        },
      },
      ProvisioningParameters: {
        minimum_contribution: "(Balance,Balance)",
        target_contribution: "(Balance,Balance)",
        accumulated_contribution: "(Balance, Balance)",
      },
      ChainId: "u8",
      ResourceId: "[u8; 32]",
      DepositNonce: "u64",
      ProposalVotes: {
        votes_for: "Vec<AccountId>",
        votes_against: "Vec<AccountId>",
        status: "ProposalStatus",
      },
      ProposalStatus: {
        _enum: { Initiated: null, Approved: null, Rejected: null },
      },
      Erc721Token: { id: "TokenId", metadata: "Vec<u8>" },
      TokenId: "U256",
      Address: "MultiAddress",
      LookupSource: "MultiAddress",
      Amount: "i128",
    };
    api = await ApiPromise.create({ provider, types: apiOps });
  }

  return api;
}

async function disconnect() {
  if (provider) {
    provider.disconnect();
  }
}

// For test
function setApi(targetApi) {
  api = targetApi;
}

function isApiConnected() {
  return provider && provider.isConnected;
}

module.exports = {
  getApi,
  disconnect,
  setApi,
  isApiConnected,
};
