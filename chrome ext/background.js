let intervalId = null;

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

  intervalId = setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }, interval);

  chrome.storage.local.set({ isActive: true, interval });
}

function stopRefreshing() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  chrome.storage.local.set({ isActive: false });
}
