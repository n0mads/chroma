const deepGet = require('lodash.get')

const { valuesOf } = require('./utils')


module.exports = class Chrome {
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

  filterTabs(params) {
    return this.getTabs().filter(new TabFilter(params).asFunction())
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

    this.addFilter('Integer', 'windowId', params.window)
    
    this.addFilter('String', 'url', params.url)
    this.addFilter('String', 'title', params.title)
    this.addFilter('String', 'status', params.status)
    
    this.addFilter('Regex', 'url', params.urlMatch)
    this.addFilter('Regex', 'title', params.titleMatch)

    this.addFilter('Boolean', 'active', params.active)
    this.addFilter('Boolean', 'pinned', params.pinned)
    this.addFilter('Boolean', 'audible', params.audible)
    this.addFilter('Boolean', 'incognito', params.incognito)
    this.addFilter('Boolean', 'mutedInfo.muted', params.muted)

    Object.freeze(this)
  }

  matchInteger(actualValue, targetValue) {
    return actualValue === parseInt(targetValue)
  }

  matchString(actualValue, targetValue) {
    return actualValue === targetValue.toString()
  }

  matchRegex(actualValue, targetValue) {
    return actualValue.match(new RegExp(targetValue))
  }

  matchBoolean(actualValue, targetValue) {
    if (typeof targetValue === 'string') {
      targetValue = (targetValue.toLowerCase() === 'true')
    }

    return actualValue === (!! targetValue)
  }

  addFilter(type, property, value) {
    if (value == null) return

    this.criteria.push(
      tab => this['match' + type](deepGet(tab, property), value)
    )
  }

  apply(tab) {
    return this.criteria.every(f => f(tab))
  }

  asFunction() {
    return this.apply.bind(this)
  }
}