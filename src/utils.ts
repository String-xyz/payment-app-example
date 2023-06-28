const userAddress = "0xC9eBA01b7249EB0d7F019946e5358a28E31edE33";
export const stringSdkOptions: any = {
  env: "LOCAL",
  apiKeyPublic: "str.fb586cb1616f45bdad9ed8d28112e433",
  bypassDeviceCheck: true,
  payload: {
    assetName: "String Test NFT [AVAX]",
    collection: "String Demo",
    price: "0.08",
    currency: "AVAX",
    imageSrc:
      "https://bafybeieqi56p6vlxofj6wkoort2m5r72ajhtikpzo53wnyze5isvn34fze.ipfs.nftstorage.link/Demo_Character_1.png",
    chainID: 43113,
    userAddress,
    contractAddress: "0xea1ffe2cf6630a20e1ba397e95358daf362c8781",
    contractFunction: "mintTo(address)",
    contractReturn: "uint256",
    contractParameters: [userAddress],
    txValue: `0.08 eth`,
  },
};
