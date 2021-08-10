const toIPA = 'convert to IPA'
const toOriginal = 'show original'
const original = 'original'
const convertedToIPA = 'converted to IPA'
const convertingToIPA = 'converting...'
const pageReloading = 'reloading...'

let tabs = {}
let subscribers = {}

const subscribe = (event, callback) => {
  if (!subscribers[event]) {
    subscribers[event] = [];
  }
  subscribers[event].push(callback);
}

const publish = (event, data) => {
  if (!subscribers[event]) return;
  subscribers[event].forEach(subscriberCallback =>
    subscriberCallback(data));
}

const getCurrentTabDetails = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab
}

const getTabsFromBrowserStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get('tabs', (res) => {
      return resolve(res['tabs'])
    })
  })
}

const setTabsInBrowserStorage = () => {
  chrome.storage.local.set({ 'tabs': tabs })
}

const checkStatusForButton = async () => {
  console.log('checking status')
  let tab = await getCurrentTabDetails()
  let state = tabs[`tab${tab.id}`]
  if (state === convertedToIPA) {
    convertText.innerHTML = toOriginal
    convertText.className = 'button undo'
    pageStatus.innerHTML = convertedToIPA
  }
  else if (state === original) {
    convertText.innerHTML = toIPA
    convertText.className = 'button do'
    pageStatus.innerHTML = original
  }
  else if (state === undefined) {
    tabs[`tab${tab.id}`] = original
    setTabsInBrowserStorage()
    convertText.innerHTML = toIPA
    pageStatus.innerHTML = original
  }
  else if (state === convertingToIPA) {
    convertText.innerHTML = toOriginal
    convertText.className = 'button undo'
    pageStatus.innerHTML = convertingToIPA
  }
  else if (state === pageReloading) {
    convertText.innerHTML = toIPA
    convertText.className = 'button do'
    pageStatus.innerHTML = pageReloading
  }
}

window.addEventListener('load', async (event) => {
  tabs = await getTabsFromBrowserStorage()
  subscribe('tabs updated', setTabsInBrowserStorage)
  subscribe('tabs updated', checkStatusForButton)
  checkStatusForButton()
});

//when convert button is clicked
convertText.addEventListener("click", async () => {
  let tab = await getCurrentTabDetails()

  if (tabs[`tab${tab.id}`] === original) {
    console.log('inside')
    tabs[`tab${tab.id}`] = convertingToIPA

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['convert to IPA button pressed.js'],
    });
  }

  else if (tabs[`tab${tab.id}`] === convertedToIPA || tabs[`tab${tab.id}`] === convertingToIPA) {
    await chrome.tabs.reload()
    tabs[`tab${tab.id}`] = original
  }

  publish('tabs updated')
});

chrome.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    let tab = await getCurrentTabDetails()
    if (message === 'reloaded') {
      tabs[`tab${tab.id}`] = original
    }
    else if (message === 'navigated') {
      // tabs = await getTabsFromBrowserStorage()
      tabs[`tab${tab.id}`] = original
      // chrome.storage.local.set({ 'tabs': tabs })
    }
    else if (message === 'converted') {
      tabs[`tab${tab.id}`] = convertedToIPA
      pageStatus.innerHTML = 'webpage converted to IPA'
    }
    publish('tabs updated')
  })

darkModeToggler.addEventListener('change', async () => {
  toggleDarkMode()
})
  
function toggleDarkMode() {
  let element = document.body;
  element.classList.toggle("dark-mode");
  let pronunciationTable = document.getElementById('pronunciationTable')
  pronunciationTable.classList.toggle("dark")
}

// toggleDarkModeButton.addEventListener("click", async () => {
//   toggleDarkMode()
// })