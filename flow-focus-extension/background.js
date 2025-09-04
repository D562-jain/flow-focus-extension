console.log("Background script started successfully!");

// 1. KEEP-ALIVE TECHNIQUE: Open a long-lived connection
// This is the most reliable way to prevent the service worker from stopping.
let keepAlivePort = null;
function connectForKeepAlive() {
  try {
    keepAlivePort = chrome.runtime.connect({ name: "KEEP_ALIVE" });
    keepAlivePort.onDisconnect.addListener(() => {
      // If the port disconnects, try to reconnect immediately.
      console.log("Keep-alive port disconnected. Reconnecting...");
      // Add a small delay before reconnecting to avoid a tight loop
      setTimeout(connectForKeepAlive, 250);
    });
    // Optional: Listen for onMessage to keep the port truly alive
    keepAlivePort.onMessage.addListener(() => {});
  } catch (error) {
    // This will catch the "Could not establish connection" error
    console.log("Reconnecting keep-alive port...");
    setTimeout(connectForKeepAlive, 250);
  }
}
connectForKeepAlive(); // Start the keep-alive on script load.

// 2. YOUR ORIGINAL FUNCTION (with logs)
async function updateBlockingRules() {
  console.log("(1) updateBlockingRules() function was called!");

  // Get both blocked and allowed sites
  const data = await chrome.storage.sync.get({
    blockedSites: [],
    allowedSites: [],
  });

  const blockedSites = data.blockedSites;
  const allowedSites = data.allowedSites;

  console.log("(2) Blocked sites:", blockedSites);
  console.log("(2) Allowed sites:", allowedSites);

  // Filter out allowed sites from blocked sites
  const sitesToBlock = blockedSites.filter(
    (site) => !allowedSites.includes(site)
  );
  console.log("(2.5) Sites that will actually be blocked:", sitesToBlock);

  const rules = sitesToBlock.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ["main_frame"],
    },
  }));

  console.log("(3) Converted them into these rules:", rules);

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule.id),
      addRules: rules,
    });
    console.log("(4) SUCCESS: Rules updated in Chrome!");
  } catch (error) {
    console.error("(4) ERROR updating rules:", error);
  }
}

// 3. Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("Storage changed! Triggering rule update...");
  if (namespace === "sync" && changes.blockedSites) {
    updateBlockingRules();
  }
});

// 4. Initial update
console.log("Calling updateBlockingRules for the first time...");
updateBlockingRules();

// 5. Optional: Log a message every minute to prove it's alive.
// This helps with debugging.
setInterval(() => {
  console.log("Service worker is still alive...");
}, 60 * 1000);
