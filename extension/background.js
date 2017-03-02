let socket


console.log("Started")
connect()


function connect() {
  console.log("Connecting to server")
  socket = io.connect('http://localhost:3000', {
    reconnection        : true,
    reconnectionAttempts: Infinity,
    reconnectionDelay   : 500,
    reconnectionDelayMax: 500,
    randomizationFactor : 0
  })

  socket.on('getState', function() {
    console.log("Sending state to server")
    getState().then(state => socket.emit('getState:response', state))
  })

  socket.on('openTab', function(options) {
    console.log('Opening tab', options)
    chrome.tabs.create(options)
  })

  socket.on('closeTab', function(options) {
    console.log('Closing tab', options)
    chrome.tabs.remove(parseInt(options.tabId))
  })

  socket.on('reloadTab', function(options) {
    console.log('Reloading tab', options)
    chrome.tabs.reload(parseInt(options.tabId))
  })

  socket.on('disconnect', function() {
    console.log("Disconnected")
  })

  socket.on('reconnect_attempt', function() {
    console.log("Attempting to reconnect...")
  })
}


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
