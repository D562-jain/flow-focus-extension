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

// 2. Main blocking function
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

  // VALIDATION: Only process valid domains
  const validSitesToBlock = sitesToBlock.filter((domain) => {
    if (domain.includes(".") && !domain.includes(" ")) {
      return true;
    } else {
      console.warn(`Invalid domain format: "${domain}". Skipping.`);
      return false;
    }
  });

  console.log("(2.6) Valid sites to block:", validSitesToBlock);

  const rules = validSitesToBlock.map((domain, index) => {
    const urlFilter = `||${domain}^`;
    console.log(
      `Creating rule ${index + 1} for: ${domain} (filter: ${urlFilter})`
    );

    return {
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: urlFilter,
        resourceTypes: ["main_frame"],
      },
    };
  });

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

// 3. Listen for storage changes - FIXED VERSION
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("Storage changed! Triggering rule update...", changes);

  // Trigger update for ANY change to blockedSites OR allowedSites
  if (namespace === "sync" && (changes.blockedSites || changes.allowedSites)) {
    console.log("Relevant change detected. Updating rules...");
    updateBlockingRules();
  }
});

// 4. Initial update
console.log("Calling updateBlockingRules for the first time...");
updateBlockingRules();

// 5. Keep-alive heartbeat
setInterval(() => {
  console.log("Service worker is still alive...");
}, 60 * 1000);

