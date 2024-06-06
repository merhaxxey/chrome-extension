let convertTimeToMS = (hours, min, sec) => {
    let msTime = 1000;
    if ((hours || min || sec) === 0) {
        return 0
    }

    msTime = (hours * 3600000) + (min * 60000) + (sec * 1000)

    return msTime
}

document.getElementById('start').addEventListener('click', () => {
    const sec = parseInt(document.getElementById('sec').value, 10);
    const min = parseInt(document.getElementById('min').value, 10);
    const hours = parseInt(document.getElementById('hours').value, 10);

    const interval = convertTimeToMS(hours, min, sec)
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