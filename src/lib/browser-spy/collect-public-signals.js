import { getGPU } from './collection-helper-functions.js';

async function collectPublicSignals() {
  try {
    const screen_resolution = window.screen.availHeight + 'x' + window.screen.availWidth;
    const cores = navigator.hardwareConcurrency;
    const language = navigator.language;
    const useragent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const gpu = getGPU();
    let device_type = "Unknown"
    if (navigator.getBattery) { // not in firefox
      const battery = (await navigator.getBattery());
      if ((battery.charging && battery.chargingTime === 0) || (!battery.charging && battery.dischargingTime === Infinity)) {
        device_type = "Desktop"
      } else {
        device_type = "Laptop"
      }
    }
    return `screen_resolution=${screen_resolution}&cores=${cores}&gpu=${gpu}&language=${language}&useragent=${useragent}&timezone=${timezone}&device_type=${device_type}`;
  } catch (e) {
    console.error("Error while collecting public signals: " + e)
    return ''
  }
};

export default collectPublicSignals;
