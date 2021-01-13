/*global chrome*/

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.clear()
    chrome.storage.sync.get(
        {
            page: 0,
            info: [],
            todo: [],
            u_id: 0
        },
        ({ page, info, todo }) => {
            chrome.storage.sync.set({
                page: page,
                info: info,
                todo: todo,
                u_id: u_id
            });
        }
    );
});
