const http = require('http')

const Chrome  = require('./Chrome')
const API     = require('./Api')
const Sockets = require('./Sockets')


const chrome = new Chrome()
const api = new API(chrome)
const sockets = new Sockets(chrome)


const server = http.createServer(api.createHandler())
sockets.attachTo(server)


server.listen(3000, function() {
  console.log("\nWaiting for Chrome extension on localhost:3000")
})