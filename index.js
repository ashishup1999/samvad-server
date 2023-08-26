const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { startDBServer } = require("./dbConn");
const authRouter = require("./controller/AuthController");

startDBServer();

app.use(cors());
app.use(express.json());
app.use(authRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (msg) => {
    socket.broadcast.emit("receive_message", msg);
  });
});

server.listen(3001, () => {
  console.log("CHAT SERVER ACTIVE ON PORT: ",3001 );
});

app.listen(3002, function (err) {
  if (err) console.log(err);
  console.log("API SERVER ACTIVE ON PORT: ", 3002);
});

module.exports = {};
