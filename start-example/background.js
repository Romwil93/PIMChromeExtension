// This script runs in the background of the extension

// Listen for a click on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
  // Open the options page when the browser action is clicked
  chrome.runtime.openOptionsPage();
});

// Listen for requests to block or unblock a website
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "block_site") {
    chrome.storage.sync.get(["blockedSites"], function(result) {
      var blockedSites = result.blockedSites || [];
      blockedSites.push(request.url);
      chrome.storage.sync.set({blockedSites: blockedSites}, function() {
        sendResponse({message: "site_blocked"});
      });
    });
  } else if (request.action === "unblock_site") {
    chrome.storage.sync.get(["blockedSites"], function(result) {
      var blockedSites = result.blockedSites || [];
      blockedSites = blockedSites.filter(function(site) {
        return site !== request.url;
      });
      chrome.storage.sync.set({blockedSites: blockedSites}, function() {
        sendResponse({message: "site_unblocked"});
      });
    });
  }
});

// Listen for requests to block requests
chrome.webRequest.onBeforeRequest.addListener(function(details) {
  // Get the list of blocked sites from storage
  chrome.storage.sync.get(["blockedSites"], function(result) {
    var blockedSites = result.blockedSites || [];
    // Check if the URL of the request matches a blocked site
    for (var i = 0; i < blockedSites.length; i++) {
      if (details.url.indexOf(blockedSites[i]) > -1) {
        // Cancel the request if it matches a blocked site
        return {cancel: true};
      }
    }
  });
}, {urls: ["<all_urls>"]}, ["blocking"]);
