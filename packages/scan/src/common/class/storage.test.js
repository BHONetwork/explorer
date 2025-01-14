const { getClassByHeight } = require("./storage");
const { setApi } = require("../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("Query class details", () => {
  let api;
  let provider;
  //wss://pub.elara.patract.io/statemine
  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/statemine", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("of 0 works", async () => {
    const height = 323750;

    const details = await getClassByHeight(0, height);
    expect(details).toEqual({
      owner: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      issuer: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      admin: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      freezer: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      totalDeposit: 0,
      freeHolding: true,
      instances: 0,
      instanceMetadatas: 0,
      attributes: 0,
      isFrozen: false,
    });
  });
});
