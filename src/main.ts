import "./style.css";
import { setupIframe } from "./iframe";
let app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div>
    <h1>Payment iFrame Example</h1>
    <h2 id="token"></h2>
    <button id="submit_card">Submit Card</button>
    <div class="string-payment-frame" />
  </div>
`;
setupIframe(app);
