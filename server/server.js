const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const yaml = require("js-yaml");
const fs = require("fs");
const mongoose = require("mongoose");

/* router list */
const dmPage = require("./routers/DMRouter");
const loginPage = require("./routers/LoginRouter");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        credential: true
    }
});

/* setting to config.yml */
const config = yaml.load(fs.readFileSync("config.yml", 'utf8'));
const hostname = config["Server"]["Host"];
const port = config["Server"]["Port"];
const dbHost = config["MongoDB"]["Host"];
const dbPort = config["MongoDB"]["Port"];
const dbName = config["MongoDB"]["Database"];

/* DB setting */
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`).then(() => {
    console.log("DB 연결 성공");
});
const db = mongoose.connection;

/* router setting */
app.use(express.json({
    limit: "50mb"
}));
app.use(cors({
    origin: "*",
    credential: true
}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
}));

app.use("/dmPage", dmPage(db));
app.use("/loginPage", loginPage(db));

/* socket setting */
const userSocketMap = new Map();

const loginSocket = require("./sockets/LoginSocket");
const dmSocket = require("./sockets/DMSocket");

io.on("connection", (socket) => {
    loginSocket(socket, userSocketMap);
    dmSocket(socket, io, userSocketMap);

    socket.on("disconnect", () => {
        // 연결이 종료된 소켓의 정보를 맵에서 제거
        for (const [userID, socketID] of userSocketMap.entries()) {
            if (socketID === socket.id) {
                userSocketMap.delete(userID);

                console.log(`Disconnecting user: ${userID} (${socketID})`);
            }
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});