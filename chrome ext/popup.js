document.getElementById('start').addEventListener('click', () => {
    const interval = parseInt(document.getElementById('interval').value, 10);
    chrome.runtime.sendMessage({ command: "start", interval }, (response) => {
      if (response.status === "ok") {
        window.close();
      }
    });
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: "stop" }, (response) => {
      if (response.status === "ok") {
        window.close();
      }
    });
  });
  
  chrome.storage.local.get(['isActive', 'interval'], (data) => {
    document.getElementById('interval').value = data.interval || 60000;
    if (data.isActive) {
      document.getElementById('start').disabled = true;
    } else {
      document.getElementById('stop').disabled = true;
    }
  });
  