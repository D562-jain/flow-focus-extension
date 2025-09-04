// This function opens a long-lived connection to keep the service worker alive.
// It's a common workaround for Manifest V3 service worker termination.
(function connect() {
  chrome.runtime
    .connect({ name: "keepAlive" })
    .onDisconnect.addListener(connect);
})();
