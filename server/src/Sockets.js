const socketIO = require('socket.io')


module.exports = class Sockets {
  constructor(chrome) {
    this.chrome = chrome
  }

  attachTo(httpServer) {
    this.io = socketIO(httpServer)

    this.io.on('connection', (client) => {
      console.log('Chrome extension connected')

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
    })

    return this.io
  }
}
