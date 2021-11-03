chrome.browserAction.onClicked.addListener(buttonClicked)

function buttonClicked(tab) {
  let message = {
    text: "hello"
  }

  chrome.tabs.sendMessage(tab.id, message)
}