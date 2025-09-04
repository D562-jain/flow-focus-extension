// DOM Elements
const allowedList = document.getElementById("allowedList");
const newAllowedInput = document.getElementById("newAllowedSite");
const addAllowedButton = document.getElementById("addAllowedButton");
const siteList = document.getElementById("siteList");
const newSiteInput = document.getElementById("newSite");
const addButton = document.getElementById("addButton");

// Function to extract only the domain from user input
function extractDomain(input) {
  // Remove http://, https://, www., and any paths
  let domain = input.replace(/^(https?:\/\/)?(www\.)?/i, ""); // Remove protocol and www
  domain = domain.split("/")[0]; // Remove everything after the first slash
  domain = domain.split("?")[0]; // Remove query parameters
  domain = domain.split(":")[0]; // Remove port numbers

  // Return only if it looks like a valid domain
  if (domain.includes(".") && !domain.includes(" ")) {
    return domain;
  }
  return null; // Invalid input
}

// Load and display the current blocked sites list
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

// Add a new site to block (WITH DOMAIN VALIDATION)
function addSite() {
  const input = newSiteInput.value.trim();
  if (!input) return;

  // Extract only the domain from whatever user typed
  const domain = extractDomain(input);
  if (!domain) {
    alert(
      'Please enter a valid domain (e.g., "youtube.com" or "www.youtube.com")'
    );
    return;
  }

  chrome.storage.sync.get({ blockedSites: [] }, function (data) {
    const updatedSites = [...new Set([...data.blockedSites, domain])]; // Avoid duplicates
    chrome.storage.sync.set({ blockedSites: updatedSites }, loadSites);
    newSiteInput.value = "";
  });
}

// Remove a site from block list
function removeSite(siteToRemove) {
  chrome.storage.sync.get({ blockedSites: [] }, function (data) {
    const updatedSites = data.blockedSites.filter(
      (site) => site !== siteToRemove
    );
    chrome.storage.sync.set({ blockedSites: updatedSites }, loadSites);
  });
}

// Load and display allowed sites
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

// Remove from allow list
function removeAllowedSite(siteToRemove) {
  chrome.storage.sync.get({ allowedSites: [] }, function (data) {
    const updatedSites = data.allowedSites.filter(
      (site) => site !== siteToRemove
    );
    chrome.storage.sync.set({ allowedSites: updatedSites }, loadAllowedSites);
  });
}

// Add to allow list
function addAllowedSite() {
  const input = newAllowedInput.value.trim();
  if (!input) return;

  // Extract only the domain from whatever user typed
  const domain = extractDomain(input);
  if (!domain) {
    alert('Please enter a valid domain (e.g., "wikipedia.org")');
    return;
  }

  chrome.storage.sync.get({ allowedSites: [] }, function (data) {
    const updatedSites = [...new Set([...data.allowedSites, domain])];
    chrome.storage.sync.set({ allowedSites: updatedSites }, function () {
      loadAllowedSites();
      newAllowedInput.value = "";
    });
  });
}

// Event Listeners
addButton.addEventListener("click", addSite);
newSiteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addSite();
});

addAllowedButton.addEventListener("click", addAllowedSite);
newAllowedInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addAllowedSite();
});

// Initial load
loadSites();
loadAllowedSites();

