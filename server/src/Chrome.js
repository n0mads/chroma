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
