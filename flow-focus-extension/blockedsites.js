const allowedList = document.getElementById("allowedList");
const newAllowedInput = document.getElementById("newAllowedSite");
const addAllowedButton = document.getElementById("addAllowedButton");
const siteList = document.getElementById("siteList");
const newSiteInput = document.getElementById("newSite");
const addButton = document.getElementById("addButton");

// Load and display the current list
function loadSites() {
  chrome.storage.sync.get({ blockedSites: [] }, function (data) {
    siteList.innerHTML = "";
    data.blockedSites.forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => removeSite(site));
      li.appendChild(removeButton);
      siteList.appendChild(li);
    });
  });
}

// Add a new site
function addSite() {
  const site = newSiteInput.value.trim();
  if (!site) return;
  chrome.storage.sync.get({ blockedSites: [] }, function (data) {
    const updatedSites = [...new Set([...data.blockedSites, site])]; // Avoid duplicates
    chrome.storage.sync.set({ blockedSites: updatedSites }, loadSites);
    newSiteInput.value = "";
  });
}

// Remove a site
function removeSite(siteToRemove) {
  chrome.storage.sync.get({ blockedSites: [] }, function (data) {
    const updatedSites = data.blockedSites.filter(
      (site) => site !== siteToRemove
    );
    chrome.storage.sync.set({ blockedSites: updatedSites }, loadSites);
  });
}

// Event Listeners
addButton.addEventListener("click", addSite);
newSiteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addSite();
});

// Initial load
loadSites();

function loadAllowedSites() {
  chrome.storage.sync.get({ allowedSites: [] }, function (data) {
    allowedList.innerHTML = "";
    data.allowedSites.forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => removeAllowedSite(site));
      li.appendChild(removeButton);
      allowedList.appendChild(li);
    });
  });
}

// Add function to remove from allow list
function removeAllowedSite(siteToRemove) {
  chrome.storage.sync.get({ allowedSites: [] }, function (data) {
    const updatedSites = data.allowedSites.filter(
      (site) => site !== siteToRemove
    );
    chrome.storage.sync.set({ allowedSites: updatedSites }, loadAllowedSites);
  });
}

// Add function to add to allow list
function addAllowedSite() {
  const site = newAllowedInput.value.trim();
  if (!site) return;
  chrome.storage.sync.get({ allowedSites: [] }, function (data) {
    const updatedSites = [...new Set([...data.allowedSites, site])];
    chrome.storage.sync.set({ allowedSites: updatedSites }, function () {
      loadAllowedSites();
      newAllowedInput.value = "";
    });
  });
}

// Add event listeners
addAllowedButton.addEventListener("click", addAllowedSite);
newAllowedInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addAllowedSite();
});

// Load allowed sites on page load
loadAllowedSites();
