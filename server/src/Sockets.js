const socketIO = require('socket.io')


module.exports = class Sockets {
  constructor(chrome) {
    this.chrome = chrome
  }

  configure(io) {
    io.on('connection', (client) => {
      console.log('Chrome extension connected')

      this.configurePolling(client)
      this.configureActions(client)
    })
  }

  configureActions(client) {
    const ev = this.chrome.events

    ev.on('openTab'  , options => client.emit('openTab', options))
    ev.on('closeTab' , options => client.emit('closeTab', options))
    ev.on('reloadTab', options => client.emit('reloadTab', options))
  }

  configurePolling(client) {
    let updateTimer
    const requestUpdate = () => client.emit('getState')

    client.on('getState:response', (state) => {
      this.chrome.replaceState(state)
    })

    client.on('disconnect', () => {
      clearInterval(updateTimer)
    })

    updateTimer = setInterval(requestUpdate, 2000)
    requestUpdate()
  }

  attachTo(httpServer) {
    const io = socketIO(httpServer)
    this.configure(io)
  }
}
