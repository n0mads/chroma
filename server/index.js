const express  = require('express')
const http     = require('http')
const socketIO = require('socket.io')


const app    = express()
const server = http.createServer(app)
const io     = socketIO(server)


// class Chrome {
//   constructor() {
//     this.windows = {}
//   }

//   updateAll(overview) {
//     this.windows = {}
//     overview.
//   }
// }


io.on('connection', function(client) {
  console.log('Chrome extension connected')

  client.on('updateWindow', function(wnd) {
    wnd.tabs = {}
    chrome.windows[wnd.id] = wnd
  })

  client.on('updateTab', function(tab) {
    chrome.windows[tab.windowId].tabs[tab.id] = tab
  })

  client.on('updateAll', function(all) {
    console.log(JSON.stringify(all, null, 2))
  })

  client.emit('getOverview')
})


app.get('/chrome/windows', function(req, res) {
  res.send(chrome.windows)
})


server.listen(3000, function() {
  console.log("\nWaiting for Chrome extension on localhost:3000")
})