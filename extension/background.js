

chrome.browserAction.onClicked.addListener(function(tab) {
  const socket = io.connect('http://localhost:3000')

  socket.on('getOverview', function() {
    getOverview().then(overview => socket.emit('updateAll', overview))
  })

  console.log("Chroma started")
});



function getOverview() {
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
