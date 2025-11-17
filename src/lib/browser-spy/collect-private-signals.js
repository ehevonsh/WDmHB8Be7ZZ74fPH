import { getCanvas, getWebgl } from './collection-helper-functions.js';
import { collectPublicSignals } from "../browser-spy";

async function collectPrivateSignals() {
  try {
    let public_string = await collectPublicSignals()
    if (public_string) {
      public_string += '&'
    }
    const time = Math.round(new Date().getMinutes() / 1) * 1;
    // navigator.storage is not available through http
    let storage = 0
    try {
      storage = Math.round((await navigator.storage.estimate()).quota / 100000000); // incognito measures are unreliable and overtime change needs to be accounted for (likely means automatically updating it as well)
    } catch {
      storage = null
    }
    const ram = (performance.memory?.totalJSHeapSize / 1024 / 1024).toFixed(0) // not in firefox, needs a rework
    let ip_data = null
    try {
      ip_data = await (await fetch('https://ipapi.co/json/')).json() // cors limitations need a workaround, same with dns and webrtc
    } catch {
      console.log("Failed to get ip data")
    }
    //console.log(ip_data)
    const webgl_hash = await getWebgl()
    const [canvas_hash, spoofed_canvas] = await getCanvas() // os-specific variance requires further testing
    // idk if audio can be reasonably fingerprinted, haven't found a reliable way to fingerprint one by it yet
    const auth_string = public_string + `storage=${storage}&webgl_hash=${webgl_hash}&canvas_hash=${canvas_hash}&spoofed_canvas=${spoofed_canvas}&ip_data=${ip_data?.city},${ip_data?.asn}&ram=${ram}&time=${time}`;
    console.log(auth_string);
    return auth_string;
  } catch (e) {
    console.error("Error while collecting private signals: " + e)
  }
}

export default collectPrivateSignals;
