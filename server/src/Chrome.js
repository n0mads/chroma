const EventEmitter = require('events')
const deepGet = require('lodash.get')

const { valuesOf } = require('./utils')


module.exports = class Chrome {
  constructor() {
    this.lastUpdate = null
    this.windowsById = null
    this.tabsById = null
    this.events = new EventEmitter()
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

  filterTabs(params) {
    return this.getTabs().filter(new TabFilter(params).asFunction())
  }

  openTab(url, options) {
    this.events.emit('requestOpenTab', Object.assign({ url }, options))
  }

  closeTab(tabId) {
    this.events.emit('requestCloseTab', { tabId })
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


class TabFilter {
  constructor(params) {
    this.params = params
    this.criteria = []

    this.matchExact('windowId', params.windowId)
    this.matchExact('url', params.url)
    this.matchExact('title', params.title)
    this.matchExact('status', params.status)
    this.matchExact('active', params.active)
    this.matchExact('pinned', params.pinned)
    this.matchExact('audible', params.audible)
    this.matchExact('incognito', params.incognito)
    this.matchExact('mutedInfo.muted', params.muted)
    
    this.matchRegex('url', params.urlMatch)
    this.matchRegex('title', params.titleMatch)

    Object.freeze(this)
  }

  matchExact(property, expected) {
    this.addFilter(property, expected, compareExact)
  }

  matchRegex(property, expected) {
    this.addFilter(property, expected, compareRegex)
  }

  addFilter(property, expected, compare) {
    if (expected != null) {
      this.criteria.push(tab => compare(deepGet(tab, property), expected))
    }
  }

  apply(tab) {
    return this.criteria.every(f => f(tab))
  }

  asFunction() {
    return this.apply.bind(this)
  }
}


function compareExact(actual, expected) {
  return actual === expected
}


function compareRegex(actual, expected) {
  return (actual.toString().match(new RegExp(expected)) != null)
}