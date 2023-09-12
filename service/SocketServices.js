const { SOCKET_NAMES } = require("../constants/CommonConstants");
const {
  getAllChatIds,
  addMsgToChat,
  updateMsgInfo,
} = require("../db/SocketRepo");

const joinRoom = async (socket) => {
  socket.on(SOCKET_NAMES.JOIN_ROOM, (req) => {
    const { chatId } = req;
    socket.join(chatId);
  });
};

const messageSendingAndReceiving = (socket) => {
  socket.on(SOCKET_NAMES.SEND_MSG, async (req) => {
    //getting from sender to server
    const { chatId, msgObj } = req;
    socket.to(chatId).emit(SOCKET_NAMES.RECEIVE_MSG, req); //sending from server to receiver
    //add msg to db
    await addMsgToChat(chatId, msgObj);
  });

  socket.on(SOCKET_NAMES.MSG_DELIVERED, async (req) => {
    //update in db that msg has been delivered
    await updateMsgInfo(...req);
  });

  socket.on(SOCKET_NAMES.MSG_SEEN, async (req) => {
    //update in db that msg has been seen
    await updateMsgInfo(...req);
  });
};

//This is for activating all room at the start of server
const switchOnAllRoomsOnServerStart = async (socket) => {
  const allChatIds = await getAllChatIds();
  allChatIds?.forEach((chatId) => {
    socket.join(chatId);
  });
};

module.exports = {
  switchOnAllRoomsOnServerStart,
  joinRoom,
  messageSendingAndReceiving,
};
