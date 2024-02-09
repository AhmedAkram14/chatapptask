const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT , () => console.log(`server running at ${PORT}`));
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname)));

io.on("connection" , onConnected);

let scocketsConneted = new Set()
function onConnected(socket) {
    console.log(socket.id)
    scocketsConneted.add(socket.id)

    io.emit("clients-total" , scocketsConneted.size)
    socket.on("disconnect", () => {
        console.log(socket.id)
        scocketsConneted.delete(socket.id)
        io.emit("clients-total" , scocketsConneted.size)
    })
    socket.on("message", (data) => {
        console.log(data)
        socket.broadcast.emit("chat-message", data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}