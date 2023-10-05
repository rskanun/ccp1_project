const dmSocket = (socket, io, userSocketMap) => {
    // DM 전송 시 해당 아이디와 일치하는 유저의 socket에만 메세지 전송
    socket.on("sendMessage", (data) => {
        const receiverID = (data.Sender === "user1") ? "user2" : "user1";
        const socketID = userSocketMap.get(receiverID);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("newMessage", data);
        }
    });

    socket.on("deleteMessage", (data) => {
        const receiverID = (data.sender === "user1") ? "user2" : "user1";
        const socketID = userSocketMap.get(receiverID);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("delMessage", data);
        }
    })
}

module.exports = dmSocket;