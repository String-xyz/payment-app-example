let iframe = document.createElement("iframe");

export function setupIframe(element: HTMLDivElement) {
  const handleEvent = (e: any) => {
    // Filter Metamask events
    if (e.data?.data?.name) return;
    // Filter Checkout events
    if (e.data?.type == "cko-msg") return;
    try {
      const payload = JSON.parse(e.data);
      const event = payload.data;
      if (event.eventName == "card_tokenized") {
        displayToken(event.data);
      }
      console.log("event", event);
    } catch (e) {
      console.error("error parsing event", e);
    }
  };

  iframe.src = "http://localhost:4041/?appType=web"; // iframe needs to be running
  iframe.style.width = "600px";
  iframe.style.height = "600px";
  element.appendChild(iframe);
  window.addEventListener("message", handleEvent);
  setupButton();
}

const submitCard = () => {
  const message = JSON.stringify({
    channel: "STRING_PAY",
    data: { eventName: "submit_card" },
  });
  iframe.contentWindow?.postMessage(message, "*");
  console.log("submit card");
};

const setupButton = () => {
  const submitCardButton = document.querySelector("#submit_card")!;
  submitCardButton.addEventListener("click", submitCard);
};

const displayToken = (token: string) => {
  const tokenElement = document.querySelector("#token")!;
  tokenElement.innerHTML = `token: ${token}`;
};
