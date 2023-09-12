const Chat = require("../model/Chat");
const { deleteNullUndefinedFromObj } = require("../utils/Utility");
const { getUserInfo } = require("./CommonRepo");

const getAllLatestChats = async (username) => {
  const allLatestChat = await Chat.find({ usernames: username }).exec();
  return allLatestChat?.map((obj) => ({
    chatId: obj?.chatId,
    otherUser: obj?.usernames?.filter((uname) => uname !== username)?.[0],
    lastMsg: obj?.msgs?.slice(-1)?.[0],
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

const getChatInfoByChatId = async (username, chatId) => {
  const { usernames, msgs } = (await Chat.find({ chatId }).exec())?.[0];
  const otherUsersInfo = usernames.filter((uname) => uname !== username);
  const otherUsers = [];
  for (let i = 0; i < otherUsersInfo.length; i++) {
    const t = await getUserInfo(otherUsersInfo[i]);
    otherUsers.push(t);
  }
  return {
    users: otherUsers,
    msgs: msgs.map((msgObj) => ({
      msgId: msgObj?.msgId,
      msg: msgObj?.msg,
      sender: msgObj?.sender,
      sentAt: msgObj?.sentAt,
      seen: msgObj?.seen,
    })),
  };
};

module.exports = {
  getAllLatestChats,
  addMsgToChat,
  createChat,
  getChatInfoByChatId,
};
