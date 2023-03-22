const express = require("express");
const path = require("path")
const http = require("http");
const { formatMessage } = require("./utils/messages")
const { userJoin, getCurrentUser, userLeave, getRoomUsers, } = require("./utils/users");

const socketio = require("socket.io");
const admin = 'Admin'

const app = express();
const server = http.createServer(app)
const io = socketio(server)




// set the static folder
app.use(express.static(path.join(__dirname, "public")))

// Run only when client connect
io.on("connection", socket => {
    console.log("New user is connected...")

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //Welcome to current user 
        socket.emit("message", formatMessage(admin, 'Welcome to group chat'))

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(admin, ` ${user.username} has joined the chat!`))

        // listen for the chat message
        socket.on('chatMessage', msg => {
            // console.log(msg)
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, msg))
        })
    })





    // Runs when a clients disconnect
    socket.on("disconnect", () => {
        const user=userLeave(socket.id)
        if(user){
            console.log("A user is left the chat...")
            io.to(user.room).emit('message', formatMessage(admin, ` ${user.username} has left the chat!`))
        }
        
    })

})

const port = 8080 || process.env.port;

server.listen(port, () => {
    console.log(`port is running at ${port}`)
})