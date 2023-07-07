import * as stringPaySdk from "@stringpay/sdk";

const userAddress = import.meta.env.VITE_USER_ADDRESS;
const STRING_API_KEY = import.meta.env.VITE_STRING_API_KEY;

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
  apiKey: STRING_API_KEY,
  bypassDeviceCheck: true,
});

const style = {
  PCIInnerElements: {
    base: {
      color: "#0C1116",
      fontSize: "16px",
    },
    placeholder: {
      base: {
        color: "#8A98A9",
      }
    }
  },
  container: "h-full w-full mt-10 px-8 pb-6",

  spacer: "space-y-4",

  CVVExpiryContainer: "flex flex-row gap-x-5",

  inputContainer: "basis-1/2",

  inputLabel: "block text-sm font-medium mb-1 text-white",

  PCIInputWrapper: `text-sm text-white 
          bg-transparent border rounded leading-5 py-2 px-3 
          focus:outline-none focus:border-gray-300
          hover:border-gray-300
          border-gray-200 h-10 shadow-sm`,

  nonePCIInputWrapper: `text-sm text-white 
          bg-transparent border rounded leading-5 py-2 px-3 
          focus:outline-none focus:border-gray-300 
          border-gray-200 hover:border-gray-300
          h-10 shadow-sm placeholder-white w-full`,

  error: `text-red-500 outline outline-1 
    min-h-8 h-auto outline-rose-500 rounded m-1 
    bg-rose-200 p-2 text-xs w-auto md:w-6/12 
    lg:w-3/12`,
}

export async function setupIframe(app: HTMLDivElement) {
  // 2. Set style
  stringPay.subscribeTo("iframe_loaded", () => {
    console.log("hello subscribed")
    stringPay.setStyle(style);
  });

  // 1. Load iframe
  await stringPay.loadIframe(payload);

  // await stringPay.setStyle(style);
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
      // console.log(">>>>>>> Card validation changed", data);
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
