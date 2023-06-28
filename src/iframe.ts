import { stringSdkOptions } from "./utils";
import * as stringPaySdk from "@stringpay/sdk";

const stringpay = stringPaySdk.init(stringSdkOptions);

export async function setupIframe(app: HTMLDivElement) {
  // 1. Load iframe
  await stringpay.loadIframe();

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

    stringpay.subscribeToQuote(cb);
    setTimeout(() => stringpay.unsubscribeFromQuote(cb), 10000);

    // TODO: stringpay.subscribeTo(stringpay.events.CARD_TOKENIZED, (token: string) => {
    stringpay.subscribeTo("card_tokenized", (token: string) => {
      console.log("Card tokenized", token);
      displayToken(token);
    });
    const token = await stringpay.submitCard();
    console.log("Card awaited", token);

    const quote = await stringpay.getQuote();

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
