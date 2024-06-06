let intervalId = null;
let countdownIntervalId = null;
let countdownTime = 0;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isActive: false, interval: 60000 });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "start") {
        startRefreshing(request.interval);
    } else if (request.command === "stop") {
        stopRefreshing();
    }
    sendResponse({ status: "ok" });
});

function startRefreshing(interval) {
    if (intervalId) clearInterval(intervalId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);

    countdownTime = interval / 1000;
    updateBadge();

    intervalId = setInterval(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    }, interval);

    countdownIntervalId = setInterval(() => {
        countdownTime--;
        if (countdownTime <= 0) {
            countdownTime = interval / 1000;
        }
        updateBadge();
    }, 1000);

    chrome.storage.local.set({ isActive: true, interval });
}

function stopRefreshing() {
    if (intervalId) clearInterval(intervalId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    intervalId = null;
    countdownIntervalId = null;
    chrome.storage.local.set({ isActive: false });
    chrome.action.setBadgeText({ text: '' });
}

function updateBadge() {
    chrome.action.setBadgeText({ text: countdownTime.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#FF5733' });
}