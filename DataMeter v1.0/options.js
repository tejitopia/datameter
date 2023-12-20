// options.js
// Script to handle saving and loading the user's preferred video quality settings.

// Save the user's options to chrome.storage
function saveOptions() {
  var quality = document.getElementById('quality').value;
  chrome.storage.local.set({
    defaultQuality: quality
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box state using the preferences stored in chrome.storage
function restoreOptions() {
  chrome.storage.local.get({
    defaultQuality: 'hd720' // Default value
  }, function(items) {
    document.getElementById('quality').value = items.defaultQuality;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
