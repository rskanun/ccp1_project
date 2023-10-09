const dmSocket = (socket, io, userSocketMap) => {
    // DM 전송 시 해당 아이디와 일치하는 유저의 socket에만 메세지 전송
    socket.on("sendMessage", (data) => {
        const socketID = userSocketMap.get(data.Receiver);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("newMessage", data);
            console.log("send message to online user: " + data.Receiver);
        }
        else
            console.log("send message to offline user: " + data.Receiver);
    });

    socket.on("deleteMessage", (data) => {
        const socketID = userSocketMap.get(data.Receiver);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("delMessage", data);
            console.log("del message to online user: " + data.Receiver);
        }
        else
            console.log("del message to offline user: " + data.Receiver);
    })
}

module.exports = dmSocket;