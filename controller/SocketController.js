const { SOCKET_NAMES } = require("../constants/CommonConstants");
const {
  joinRoom,
  messageSendingAndReceiving,
  switchOnAllRoomsOnServerStart,
} = require("../service/SocketServices");

module.exports = (io) => {
  io.on(SOCKET_NAMES.CONNECTION, (socket) => {
    switchOnAllRoomsOnServerStart(socket);
    joinRoom(socket);
    messageSendingAndReceiving(socket);
  });
};
