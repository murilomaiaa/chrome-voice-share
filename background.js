console.log('background')

navigator.mediaDevices.getUserMedia({ audio: true })
.then(console.log)
.catch(() => {
  let helpTabIsOpened = false;
  let activeTabId = -1;
  const helpUrl = chrome.extension.getURL("option.html");
  chrome.tabs.query({}, tabs => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url === helpUrl) {
        chrome.tabs.update(tabs[i].id, { highlighted: true });
        helpTabIsOpened = true;
      }
      if (tabs[i].active) {
        activeTabId = tabs[i].id;
      }
    }
    if (!helpTabIsOpened) {
      chrome.tabs.create({ url: helpUrl }, () => {});
    }
    chrome.tabs.update(activeTabId, { highlighted: false });
  });
})
