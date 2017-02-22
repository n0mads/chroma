const express = require('express')


module.exports = class API {
  constructor(chrome) {
    this.chrome = chrome
  }

  createHandler() {
    this.app = express()

    this.app.get('/chrome', (req, res) => {
      res.send(this.chrome.toObject())
    })


    this.app.get('/chrome/windows', (req, res) => {
      res.send(this.chrome.getWindows())
    })


    this.app.get('/chrome/windows/:windowId', (req, res) => {
      res.send(this.chrome.getWindow(req.params.windowId))
    })


    this.app.get('/chrome/tabs/:tabId', (req, res) => {
      res.send(this.chrome.getTab(req.params.tabId))
    })


    this.app.get('/chrome/windows/:windowId/tabs', (req, res) => {
      res.send(this.chrome.getTabsIn(req.params.windowId))
    })


    this.app.get('/chrome/windows/:windowId/tabs/:tabId', (req, res) => {
      res.send(this.chrome.getTab(req.params.tabId))
    })

    return this.app
  }
}


module.exports = {
  createHandler
}