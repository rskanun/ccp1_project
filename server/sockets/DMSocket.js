const ObjectId = require("mongodb").ObjectId;

const dmSocket = (socket, io, db, userSocketMap) => {
    // DM 전송 시 해당 아이디와 일치하는 유저의 socket에만 메세지 전송
    socket.on("sendMessage", async (data) => {
        const socketID = userSocketMap.get(data.Receiver);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("newMessage", data);
            console.log(socketID);
        }
        else {
            await db.collection("DM").findOneAndUpdate(
                { DM_ID: new ObjectId(data.DM_ID), User_ID: data.Receiver },
                { $set: { Is_Reading: false } }
            );
        }
    });

    socket.on("deleteMessage", (data) => {
        const socketID = userSocketMap.get(data.Receiver);

        // 메세지를 보내는 유저의 소켓이 존재할 경우 실시간 업데이트
        if(socketID) {
            io.to(socketID).emit("delMessage", data);
        }
    })
}

module.exports = dmSocket;