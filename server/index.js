//index kreira server koji koristi app i socket
// koji ce cekati konekcije i "zahtjeve"
//obavezno jedna io.on('connection',(socket))

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom} = require('./users');

//PORT
const PORT = process.env.PORT || 5000;

//ruter
const router = require('./router');

const app = express();
//server za io
const server = http.createServer(app);
io = socketio(server);

io.on('connection', (socket) =>{
    console.log('We have a new connection!!!');
    //callback je za hendlanje gresaka
    socket.on('join', ({name, room}, callback) => {
       const { error, user } = addUser({ id: socket.id, name, room });

       if(error) return error;

       socket.emit('message', { user: 'admin', text: `${user.name} welcome to the room ${user.room}` });
       socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined`});

       socket.join(user.room);

       io.to(user.room).emit('roomData', {room: user.room, user: getUsersInRoom(user.room)});

       callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, user: getUsersInRoom(user.room)});
        callback();
    });

    socket.on('disconnect', () =>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left.`});
        }
    });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));