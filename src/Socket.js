import { io } from "socket.io-client";

export const socketIO = io("http://localhost:4000");