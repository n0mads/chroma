const express = require('express')
const httpAttach = require('http-attach')


module.exports = class API {
  constructor(chrome) {
    this.chrome = chrome
  }

  configure(app) {
    app.get('/chrome', (req, res) => {
      res.send(this.chrome.toObject())
    })


    app.get('/chrome/windows', (req, res) => {
      res.send(this.chrome.getWindows())
    })

    app.get('/chrome/windows/:windowId', (req, res) => {
      res.send(this.chrome.getWindow(req.params.windowId))
    })

    app.get('/chrome/windows/:windowId/tabs', (req, res) => {
      res.send(this.chrome.getTabsIn(req.params.windowId))
    })

    app.get('/chrome/windows/:windowId/tabs/:tabId', (req, res) => {
      res.send(this.chrome.getTab(req.params.tabId))
    })


    app.get('/chrome/tabs', (req, res) => {
      res.send(this.chrome.getTabs())
    })

    app.post('/chrome/tabs', (req, res) => {
      res.send(this.chrome.openTab(req.query))
    })

    app.get('/chrome/tabs/filter', (req, res) => {
      res.send(this.chrome.filterTabs(req.query))
    })

    app.get('/chrome/tabs/:tabId', (req, res) => {
      res.send(this.chrome.getTab(req.params.tabId))
    })
  }

  attachTo(httpServer) {
    const app = express()
    this.configure(app)

    httpAttach(httpServer, app)
  }
}
