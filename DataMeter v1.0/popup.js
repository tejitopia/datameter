// popup.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup DOM fully loaded and parsed.');

    const saveButton = document.getElementById('save');
    const qualitySelect = document.getElementById('quality');
    const statusDiv = document.getElementById('status');

    // Load the saved quality setting and log the result for debugging
    chrome.storage.local.get(['defaultQuality'], function(result) {
        console.log('Loaded saved quality setting:', result.defaultQuality);
        qualitySelect.value = result.defaultQuality || '720p';
    });

    // Save the selected quality setting and show a success message
    saveButton.addEventListener('click', () => {
        console.log('Save button clicked.');
        chrome.storage.local.set({ 'defaultQuality': qualitySelect.value }, () => {
            console.log('Settings saved with quality:', qualitySelect.value);
            saveButton.textContent = 'Success';
            saveButton.classList.add('success');
            statusDiv.style.visibility = 'visible';
            
            // Reset the button text after a delay and log the reset for debugging
            setTimeout(() => {
                console.log('Resetting save button text and status visibility.');
                saveButton.textContent = 'Save Settings';
                saveButton.classList.remove('success');
                statusDiv.style.visibility = 'hidden';
            }, 2000);
        });
    });
});
