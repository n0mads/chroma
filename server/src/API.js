const express = require('express')
const httpAttach = require('http-attach')

const { removeNulls, parseBoolean, parseInteger } = require('./utils')


module.exports = class API {
  constructor(chrome) {
    this.chrome = chrome
  }

  configure(app) {
    // Full overview:

    app.get('/chrome', (req, res) => {
      res.send(this.chrome.toObject())
    })

    // Window information:

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

    // Tab information:

    app.get('/chrome/tabs', (req, res) => {
      res.send(this.chrome.getTabs())
    })

    app.get('/chrome/tabs/filter', (req, res) => {
      const options = removeNulls({
        url       : req.query.url,
        urlMatch  : req.query.urlMatch,
        title     : req.query.title,
        titleMatch: req.query.titleMatch,
        status    : req.query.status,
        windowId  : parseInteger(req.query.windowId),
        active    : parseBoolean(req.query.active),
        pinned    : parseBoolean(req.query.pinned),
        audible   : parseBoolean(req.query.audible),
        incognito : parseBoolean(req.query.incognito),
        muted     : parseBoolean(req.query.muted)
      })

      res.send(this.chrome.filterTabs(options))
    })

    app.get('/chrome/tabs/:tabId', (req, res) => {
      res.send(this.chrome.getTab(req.params.tabId))
    })

    // Actions:

    app.post('/chrome/tabs/open', (req, res) => {
      const options = removeNulls({
        windowId: parseInteger(req.query.windowId),
        index   : parseInteger(req.query.index),
        active  : parseBoolean(req.query.active) || false,
        pinned  : parseBoolean(req.query.pinned)
      })

      res.send(this.chrome.openTab(req.query.url, options))
    })

    app.post('/chrome/tabs/:tabId/close', (req, res) => {
      res.send(this.chrome.closeTab(req.params.tabId))
    })

    app.post('/chrome/tabs/:tabId/reload', (req, res) => {
      res.send(this.chrome.reloadTab(req.params.tabId))
    })

    // Middlware:
    app.use(logErrors)
  }

  attachTo(httpServer) {
    const app = express()
    this.configure(app)

    httpAttach(httpServer, app)
  }
}


function logErrors (err, req, res, next) {
  console.log('handling')
  console.error(err.stack)
  next(err)
}