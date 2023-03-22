const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io");
const { Socket } = require("dgram");

const app = express();
const server = http.createServer(app)
const io = socketio(server)




// set the static folder
app.use(express.static(path.join(__dirname, "public")))

// Run only when client connect
io.on("connect", socket => {
    console.log("New user is connected...")
    //Welcome to current user 
    socket.emit("message", "welcome to chat group!")

    // Broadcast when a user connects
    socket.broadcast.emit('message', "A user a joined the chat!")

    // Runs when a clients disconnect
    socket.on("disconnect", () => {
        console.log("A user is left the chat...")
        io.emit('message', 'A user has left the chat')
    })
    // listen for the chat message
    socket.on('chatMessage', msg => {
        // console.log(msg)
        io.emit('message',msg)
    })


})

const port = 8080 || process.env.port;

server.listen(port, () => {
    console.log(`port is running at ${port}`)
})