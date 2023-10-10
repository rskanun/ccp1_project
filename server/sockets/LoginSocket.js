const loginSocket = (socket, userSocketMap) => {
    // 로그인 시 해당 유저의 id와 socket.id를 맵에 저장
    socket.on("login", (userID) => {
        userSocketMap.set(userID, socket.id);

        console.log(`Connecting user: ${userID} (${socket.id})`);
    })

    // 로그아웃 시 해당 유저의 id와 socket.id를 맵에 삭제
    socket.on("logout", (userID) => {
        const socketID = userSocketMap.get(userID);
        userSocketMap.delete(userID);
        
        console.log(`Disconnecting user: ${userID} (${socketID})`);
    })
}

module.exports = loginSocket;