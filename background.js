chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateFavorites") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: refreshFavorites
            });
        });
    }
});

function refreshFavorites() {
    if (typeof displayFavorites === "function") {
        displayFavorites();
    }
}
