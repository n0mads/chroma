let socket


console.log("Started")
connect()


function connect() {
  console.log("Connecting to server")
  socket = io.connect('http://localhost:3000')

  socket.on('getState', function() {
    console.log("Sending state to server")
    getState().then(state => socket.emit('getState:response', state))
  })

  socket.on('openTab', function(options) {
    console.log(options)
    chrome.tabs.create(options)
  })

  socket.on('disconnect', function() {
    // SocketIO will automatically attempt to reconnect
    console.log("Disconnected. Auto-reconnecting...")
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
