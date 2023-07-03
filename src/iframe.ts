import * as stringPaySdk from "@stringpay/sdk";

const userAddress = "0xa4b9a1cc3cc2d7944bdce4523d9878b8dbb5f295";

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

const stringPay = stringPaySdk.init({
  env: "LOCAL",
  apiKeyPublic: "str.144dc50d57a84b09b95c51738b01377c",
  bypassDeviceCheck: true,
});

export async function setupIframe(app: HTMLDivElement) {
  // 1. Load iframe
  await stringPay.loadIframe(payload);

  // 2. set up buttons
  setupButtons();
}

function setupButtons() {
  const submitCardButton = document.querySelector("#submit_card")!;
  submitCardButton.addEventListener("click", submitCard);
}

async function submitCard() {
  try {
    const user = await stringPay.authorizeUser();

    console.log("User authorized", user);

    if (user.status != "email_verified") {
      console.log("-- Requesting email verification --");
      if (user.email == "") {
        // get email from user input
        await stringPay.verifyEmail(
          user.id,
          "test@string.xyz"
        );
      } else {
      }
      await stringPay.verifyEmail(
        user.id,
        "test2@string.xyz"
      );

      console.log("-- Email verified --");
    }

    const cb = (quote: any) => console.log("New Quote", quote);

    stringPay.subscribeToQuote(payload, cb);
    setTimeout(() => stringPay.unsubscribeFromQuote(cb), 10000);

    // TODO: stringPay.subscribeTo(stringPay.events.CARD_TOKENIZED, (token: string) => {
    stringPay.subscribeTo("card_tokenized", (token: string) => {
      console.log("Card tokenized", token);
      displayToken(token);
    });

    stringPay.subscribeTo("card_validation_changed", (data: any) => {
      if (data) {
        // set card submit button to active
        console.log("true: ",data)
      } else {
        // set card submit button to inactive
        console.log("false: ",data)
      }
      console.log(">>>>>>> Card validation changed", data);
    });
    // on card submit button click
    const token = await stringPay.submitCard();
    console.log("Card awaited", token);

    const quote = await stringPay.getQuote(payload);

    console.log("---- Submitting transaction ----");
    const tx = await stringPay.submitTransaction({
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
