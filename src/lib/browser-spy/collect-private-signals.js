import { getCanvas, getWebgl } from "./collection-helper-functions.js";
import { collectPublicSignals } from "../browser-spy";

async function collectPrivateSignals() {
  try {
    let public_string = await collectPublicSignals();
    if (public_string) {
      public_string += "&";
    }
    const time = Math.round(new Date().getMinutes());
    let storage = 0;
    try {
      storage = Math.round(
        (await navigator.storage.estimate()).quota / 100000000
      );
    } catch {
      storage = null;
    }
    const ram = (performance.memory?.totalJSHeapSize / 1024 / 1024).toFixed(0); // not in firefox
    let ip_data = null;
    try {
      ip_data = await (await fetch("https://ipapi.co/json/")).json(); // backend should handle rate limits just fine
    } catch {
      console.log("Failed to get ip data, wait before refreshing.");
    }
    const webgl_hash = await getWebgl(); // spoofed by brave, however, basic detection is slightly more challanging than with canvas
    const [canvas_hash, spoofed_canvas] = await getCanvas(); // spoofing detection is evaded by brave
    const auth_string =
      public_string +
      `storage=${storage}&webgl_hash=${webgl_hash}&canvas_hash=${canvas_hash}&spoofed_canvas=${spoofed_canvas}&ip_data=${ip_data?.city},${ip_data?.asn}&ram=${ram}&time=${time}`;
    return auth_string;
  } catch (e) {
    console.error("Error while collecting private signals: " + e);
  }
}

export default collectPrivateSignals;
