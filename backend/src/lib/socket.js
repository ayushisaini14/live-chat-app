import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //for broadcasting to all users

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //for broadcasting to all users

  });
});

export { io, app, server };