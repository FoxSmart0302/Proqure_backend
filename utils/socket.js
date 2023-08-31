const { isEmpty } = require(".");


let socketConnections = [];

const onConnect = (socket) => {
    console.log('socket connected');

    if (isEmpty(socketConnections)) {
        socketConnections.push(socket);
    }
    else{
        const index = socketConnections.findIndex(connection => connection = socket);
        if (index <= 0) {
            socketConnections.push(socket);
        }
    }

    
    console.log("socket Connections Length:", socketConnections.length);
    socket.on("disconnect", () => {
        console.log("socket disconnected");
        const index = socketConnections.findIndex(connection => connection == socket);
        if (index >= 0) {
            socketConnections.splice(index, 1);
        }
    })

    activeUser();

    socket.on('error', function (error) {
        console.log("socket error: ", error)
    });
}

const activeUser = () => {
    let activeUserCount = socketConnections.length;
    socketConnections.forEach(connection => {
        connection.emit('activeUser', { activeUser: activeUserCount })
    });
}


module.exports = {
    onConnect,
    socketConnections,
}