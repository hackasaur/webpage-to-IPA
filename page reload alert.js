console.log("'page reload alert.js' loaded")
// tabStatus = {}
// let [tab] = chrome.tabs.query({ active: true, currentWindow: true });
let perfEntries = performance.getEntriesByType("navigation");
for (let i = 0; i < perfEntries.length; i++) {
    console.log("= Navigation entry[" + i + "]");
    let p = perfEntries[i];
    console.log("type = " + p.type);
    if (p.type = 'reload') {
    // tabStatus[`tab${tab.id}`] = 'original'
    // chrome.storage.local.set(tabStatus)
    chrome.runtime.sendMessage("reloaded");
    }
    else if(p.type = 'navigate'){
        chrome.runtime.sendMessage("navigated");
    }
}