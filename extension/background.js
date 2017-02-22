

chrome.browserAction.onClicked.addListener(function(tab) {
  const socket = io.connect('http://localhost:3000')

  socket.on('getState', function() {
    getState().then(state => socket.emit('getState:response', state))
  })

  console.log("Chroma started")
});



function getState() {
  return getExtendedWindows().then(windows => {
    return { timestamp: new Date().getTime(), windows }
  })
}


function getExtendedWindows() {
  return getWindows()
    .then(wins => wins.map(extendWindow))
    .then(awaitAll)
}


function extendWindow(win) {
  return getTabsInWindow(win).then(tabs => Object.assign({ tabs }, win))
}


function getWindows() {
  return new Promise(resolve => chrome.windows.getAll(resolve))
}


function getTabsInWindow(win) {
  return new Promise(resolve => chrome.tabs.getAllInWindow(win.id, resolve))
}


function awaitAll(promises) {
  return Promise.all(promises)
}
