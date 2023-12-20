// background.js

chrome.runtime.onInstalled.addListener(() => {
  // Set default quality to 720p HD when the extension is installed or updated
  chrome.storage.local.set({ defaultQuality: 'hd720' });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check for the correct action
  if (request.action === "get_quality") {
    // Retrieve the quality setting from storage and send it to the content script
    chrome.storage.local.get(['defaultQuality'], function(result) {
      if (chrome.runtime.lastError) {
        // Handle errors, such as if the 'defaultQuality' is not set
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        // Send the quality setting to the content script
        sendResponse({ quality: result.defaultQuality || 'hd720' });
      }
    });
    
    // Return true to indicate that you wish to send a response asynchronously
    return true;
  }
});
