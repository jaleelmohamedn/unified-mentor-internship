const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = {}; // socket.id → { username, room }
const usernames = new Set();

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    if ([...Object.values(users)].find(u => u.username === username)) {
      socket.emit("message", {
        username: "System",
        text: "Username already in use!",
        time: moment().format("h:mm a"),
      });
      return;
    }

    users[socket.id] = { username, room };
    socket.join(room);

    socket.emit("message", {
      username: "System",
      text: `Welcome to ${room}, ${username}!`,
      time: moment().format("h:mm a"),
    });

    socket.broadcast.to(room).emit("message", {
      username: "System",
      text: `${username} has joined the room.`,
      time: moment().format("h:mm a"),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", {
        username: user.username,
        text: msg,
        time: moment().format("h:mm a"),
      });
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", {
        username: "System",
        text: `${user.username} has left.`,
        time: moment().format("h:mm a"),
      });
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
