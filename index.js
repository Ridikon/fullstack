const app = require('./app');
const port = process.env.PORT || 5000;
const socketIO = require('socket.io');

const server = app.listen(port, () => console.log(`Server started on ${port}`));

const io = socketIO(server);

io.on('connection', function(socket){
    console.log("Socket established with id: " + socket.id);

    socket.on('disconnect', function () {
        console.log("Socket disconnected: " + socket.id);
    });

    socket.on('message', data => {
        socket.broadcast.emit('message', data);
    })
});
