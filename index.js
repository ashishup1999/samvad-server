require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./controller/AuthController");
const homeRouter = require("./controller/HomeController");
const mongoDbURI = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(
  process.env.DB_PASSWORD
)}@${process.env.DB_NAME}.kh4xc50.mongodb.net/?retryWrites=true&w=majority`;

// Connect to MongoDB database
mongoose.connect(mongoDbURI, { useNewUrlParser: true }).then(() => {
  console.log("DATABASE SERVER ON");
});

app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(homeRouter);

const chatServer = http.createServer(app);

const io = new Server(chatServer, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST"],
  },
});

require("./controller/SocketController")(io); // passing io to socket controller

chatServer.listen(process.env.CHAT_SERVER_PORT, () => {
  console.log("CHAT SERVER ACTIVE ON PORT: ", process.env.CHAT_SERVER_PORT);
});

app.listen(process.env.API_SERVER_PORT, function (err) {
  if (err) console.log(err);
  console.log("API SERVER ACTIVE ON PORT: ", process.env.API_SERVER_PORT);
});

module.exports = {};
