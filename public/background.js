/*global chrome*/

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.clear()
    chrome.storage.sync.get(
        {
            page: 0,
            info: []
        },
        ({ page, info }) => {
            chrome.storage.sync.set({
                page: page,
                info: info
            });
        }
    );
});
