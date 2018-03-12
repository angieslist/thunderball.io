module.exports = function globalSetup() {
  // allow some time for the server to start-up
  return new Promise((resolve => setTimeout(resolve, 5000)));
};
