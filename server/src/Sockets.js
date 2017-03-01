const socketIO = require('socket.io')


module.exports = class Sockets {
  constructor(chrome) {
    this.chrome = chrome
  }

  configure(io) {
    io.on('connection', (client) => {
      console.log('Chrome extension connected')

      let updateTimer
      const requestUpdate = () => client.emit('getState')

      client.on('getState:response', (state) => {
        this.chrome.replaceState(state)
      })

      client.on('disconnect', () => {
        clearInterval(updateTimer)
      })

      this.chrome.events.on('requestOpenTab', (options) => {
        client.emit('openTab', options)
      })

      updateTimer = setInterval(requestUpdate, 2000)
      requestUpdate()
    })
  }

  attachTo(httpServer) {
    const io = socketIO(httpServer)
    this.configure(io)
  }
}
