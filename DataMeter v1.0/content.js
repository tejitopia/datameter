// content.js

// Utility function to debounce calls to another function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          func.apply(this, args);
      }, wait);
  };
}

// Parse duration text and convert it to seconds
function parseDuration(durationText) {
const parts = durationText.split(':').map(Number);
let duration = 0;
for (let i = 0; i < parts.length; i++) {
    duration += parts[i] * Math.pow(60, parts.length - i - 1);
}
return duration;
}

// Estimate data usage based on quality and duration
function estimateDataUsage(quality, durationInSeconds) {
// Data usage rates in MB per minute for different qualities
const qualityRates = {
    '144p': 1.666,   // Approx 100 MB per hour
    '240p': 1.666,   // Approx 100 MB per hour
    '360p': 5,       // Approx 300 MB per hour
    '480p': 5,       // Approx 300 MB per hour
    '720p': 15,      // Approx 900 MB per hour
    '1080p': 25,     // Approx 1500 MB per hour
    '1440p': 50,     // Approx 3000 MB per hour
    '2160p': 120     // Approx 7200 MB per hour
};
const rate = qualityRates[quality] || 15; // Default to 720p rate if not found
const durationInMinutes = durationInSeconds / 60;
const dataUsageMB = rate * durationInMinutes;
return Math.round(dataUsageMB);
}

// Debounced version of the inject function to improve performance
const debouncedInjectDataUsageEstimates = debounce((quality) => {
const videoThumbnails = document.querySelectorAll('ytd-thumbnail');
videoThumbnails.forEach(thumbnail => {
    const durationElement = thumbnail.querySelector('span.ytd-thumbnail-overlay-time-status-renderer');
    if (!durationElement) return;

    const videoDuration = durationElement.textContent.trim();
    const dataUsage = estimateDataUsage(quality, parseDuration(videoDuration));

    // Remove any existing data usage label before adding a new one
    const existingLabel = thumbnail.querySelector('.data-usage-label');
    if (existingLabel) {
        existingLabel.remove();
    }

    // Create new data usage label
    const dataLabel = document.createElement('span');
    dataLabel.className = 'data-usage-label';
    dataLabel.textContent = `⚡ ${dataUsage} MB`;
    // Position the label to the left so it does not cover the video duration
    dataLabel.style.position = 'absolute';
    dataLabel.style.top = '5px';
    dataLabel.style.left = '5px';
    dataLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    dataLabel.style.color = 'white';
    dataLabel.style.padding = '2px 4px';
    dataLabel.style.borderRadius = '4px';
    dataLabel.style.fontSize = '12px';
    thumbnail.appendChild(dataLabel);
});
}, 250); // Debounce for 250 milliseconds

// Set up a MutationObserver to observe changes in the DOM and re-inject estimates
const observer = new MutationObserver(debouncedInjectDataUsageEstimates);

observer.observe(document.body, { childList: true, subtree: true });

// Initial injection
chrome.storage.local.get(['defaultQuality'], function(result) {
const quality = result.defaultQuality || 'hd720';
debouncedInjectDataUsageEstimates(quality);
});
