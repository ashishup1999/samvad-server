const Chat = require("../model/Chat");
const { deleteNullUndefinedFromObj } = require("../utils/Utility");

const getAllLatestChats = async (username) => {
  const allLatestChat = await Chat.find({ usernames: username }).exec();
  return allLatestChat?.map((obj) => ({
    chatId: obj?.chatId,
    otherUser: obj?.usernames?.filter((uname) => uname !== username)?.[0],
    lastMsg: obj?.msgs?.slice(-1)?.[0]
  }));
};

const createChat = async (usernames) => {
  await Chat.create({ usernames });
};

const addMsgToChat = async (chatId, msgObj) => {
  const msgPayload = {
    sender: msgObj.sender,
    msg: msgObj.msg,
    type: msgObj.type,
  };
  deleteNullUndefinedFromObj(msgPayload);
  await Chat.updateOne({ chatId }, { $push: { msgs: msgPayload } });
};

module.exports = {
  getAllLatestChats,
  addMsgToChat,
  createChat,
};
