import * as stringPaySdk from "@stringpay/sdk";

const userAddress = "0xC9eBA01b7249EB0d7F019946e5358a28E31edE33";

const payload = {
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
};

const stringpay = stringPaySdk.init({
  env: "LOCAL",
  apiKeyPublic: "str.fb586cb1616f45bdad9ed8d28112e433",
  bypassDeviceCheck: true,
});

export async function setupIframe(app: HTMLDivElement) {
  // 1. Load iframe
  await stringpay.loadIframe(payload);

  // 2. set up buttons
  setupButtons();
}

function setupButtons() {
  const submitCardButton = document.querySelector("#submit_card")!;
  submitCardButton.addEventListener("click", submitCard);
}

async function submitCard() {
  try {
    const user = await stringpay.authorizeUser();

    console.log("User authorized", user);

    if (user.status != "email_verified") {
      console.log("-- Requesting email verification --");

      await stringpay.verifyEmail(
        user.id,
        "wilfredo.string.xyz@mailinator.com"
      );

      console.log("-- Email verified --");
    }

    const cb = (quote: any) => console.log("New Quote", quote);

    stringpay.subscribeToQuote(payload, cb);
    setTimeout(() => stringpay.unsubscribeFromQuote(cb), 10000);

    // TODO: stringpay.subscribeTo(stringpay.events.CARD_TOKENIZED, (token: string) => {
    stringpay.subscribeTo("card_tokenized", (token: string) => {
      console.log("Card tokenized", token);
      displayToken(token);
    });

    stringpay.subscribeTo("card_validation_changed", (data: any) => {
      console.log(">>>>>>> Card validation changed", data);
    });

    const token = await stringpay.submitCard();
    console.log("Card awaited", token);

    const quote = await stringpay.getQuote(payload);

    console.log("---- Submitting transaction ----");
    const tx = await stringpay.submitTransaction({
      quote,
      paymentInfo: {
        cardToken: token,
        saveCard: true,
      },
    });
    console.log("---- TX ----", tx);
  } catch (error) {
    console.error("Error from string-sdk:", error);
  }
}

const displayToken = (token: string) => {
  const tokenElement = document.querySelector("#token")!;
  tokenElement.innerHTML = `token: ${token}`;
};
