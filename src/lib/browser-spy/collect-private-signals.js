function collectPrivateSignals() {
  // TODO: rselja will actually use this function, make sure the return type matches the strapi user model, the return value of this function is used as browserDataCombinationID (private field)
  return `screen_resolution=1920x1080&browser=chrome${
    Math.round(new Date().getMinutes() / 5) * 5
  }`;
}

export default collectPrivateSignals;
