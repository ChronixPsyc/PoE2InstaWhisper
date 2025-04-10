let isActive = false;
const toggleKey = 'autoclick_enabled';

function updateButtonText() {
    const btn = document.getElementById('toggleBtn');
    btn.textContent = isActive ? 'Disable AutoClick' : 'Enable AutoClick';
}

async function setStoredState(state) {
    await chrome.storage.local.set({ [toggleKey]: state });
}

async function getStoredState() {
    const result = await chrome.storage.local.get([toggleKey]);
    return result[toggleKey] ?? false;
}

document.getElementById('toggleBtn').addEventListener('click', async () => {
    isActive = !isActive;
    updateButtonText();
    await setStoredState(isActive);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
        type: 'toggle-autoclicker',
        state: isActive
    });
});

(async () => {
    isActive = await getStoredState();
    updateButtonText();

    // Optional: re-send state to the content script on popup open
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
        type: 'toggle-autoclicker',
        state: isActive
    });
})();