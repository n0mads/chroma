const express  = require('express')
const http     = require('http')
const socketIO = require('socket.io')


const app    = express()
const server = http.createServer(app)
const io     = socketIO(server)


function valuesOf(object) {
  return Object.keys(object).map(key => object[key])
}


class Chrome {
  constructor() {
    this.lastUpdate = null
    this.windowsById = null
    this.tabsById = null
  }

  replaceState(state) {
    this.lastUpdate = state.timestamp
    this.windowsById = {}
    this.tabsById = {}

    for (let win of state.windows) { 
      this.windowsById[win.id] = Object.assign({}, win)

      for (let tab of win.tabs) {
        this.tabsById[tab.id] = Object.assign({}, tab)
      }
    }
  }

  getWindows() {
    return valuesOf(this.windowsById)
  }

  getTabs() {
    return valuesOf(this.tabsById)
  }

  getWindow(id) {
    return this.windowsById[id]
  }

  getTab(id) {
    return this.tabsById[id]
  }

  getTabsIn(windowOrId) {
    const windowId = (typeof windowOrId === 'object')
      ? windowOrId.id
      : windowOrId

    return this.windowsById[windowId].tabs
  }

  toObject() {
    return {
      lastUpdate: this.lastUpdate,
      windows: valuesOf(this.windowsById)
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject(), null, 2)
  }
}


const chrome = new Chrome()


io.on('connection', function(client) {
  console.log('Chrome extension connected')

  client.on('getState:response', function(state) {
    chrome.replaceState(state)
    console.log(chrome.toJSON())
  })

  client.emit('getState')
})


app.get('/chrome', function(req, res) {
  res.send(chrome.toObject())
})


app.get('/chrome/windows', function(req, res) {
  res.send(chrome.getWindows())
})


app.get('/chrome/windows/:windowId', function(req, res) {
  res.send(chrome.getWindow(req.params.windowId))
})


app.get('/chrome/tabs/:tabId', function(req, res) {
  res.send(chrome.getTab(req.params.tabId))
})


app.get('/chrome/windows/:windowId/tabs', function(req, res) {
  res.send(chrome.getTabsIn(req.params.windowId))
})


app.get('/chrome/windows/:windowId/tabs/:tabId', function(req, res) {
  res.send(chrome.getTab(req.params.tabId))
})


server.listen(3000, function() {
  console.log("\nWaiting for Chrome extension on localhost:3000")
})