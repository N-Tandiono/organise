/*global chrome*/

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.clear()
    chrome.storage.sync.get(
        {
            page: 0,
        },
        ({ page }) => {
            console.log(page)
            chrome.storage.sync.set({
                page: page
            });
        }
    );
});
