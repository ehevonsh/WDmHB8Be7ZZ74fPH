const collectPublicSignals = () => {
  // TODO: rselja will actually use this function, make sure the return type matches the strapi user model, the return value of this function will be displayed to others at /users page
  return "screen_resolution=1920x1080&browser=chrome";
};

export default collectPublicSignals;
