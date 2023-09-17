const Chat = require("../model/Chat");
const User = require("../model/User");
const { deleteNullUndefinedFromObj } = require("../utils/Utility");
const { getUserInfo } = require("./CommonRepo");

const getAllLatestChats = async (username) => {
  const allLatestChat = await Chat.find({
    usernames: username,
    msgs: { $not: { $size: 0 } },
  }).exec();
  return allLatestChat?.map((obj) => ({
    chatId: obj?.chatId,
    otherUser: obj?.usernames?.filter((uname) => uname !== username)?.[0],
    lastMsg: obj?.msgs?.slice(-1)?.[0],
  }));
};

const createChat = async (usernames) => {
  const chat = await Chat.find({
    $and: [
      { usernames: { $all: usernames } },
      { usernames: { $size: usernames.length } },
    ],
  }).exec();
  if (chat.length !== 0) {
    return chat[0]?.chatId;
  }
  const res = await Chat.create({ usernames });
  return res?.chatId;
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
  const { usernames, msgs } = (
    await Chat.find({ chatId, usernames: username }).exec()
  )?.[0];
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

const getUsernamesByChatId = async (chatId) => {
  const { usernames } = (await Chat.find({ chatId }).exec())?.[0];
  return usernames;
};

const getUsersOnSearch = async (username, searchkey) => {
  const users = await User.find({
    $and: [
      { username: { $ne: username } },
      { username: { $regex: searchkey } },
    ],
  })
    .select("username email fullName profileImg -_id")
    .sort({ username: 1 })
    .limit(10);
  return users;
};

const deleteMsgs = async (chatId, msgIds) => {
  await Chat.updateMany(
    { chatId },
    { $pull: { msgs: { msgId: { $in: msgIds } } } }
  );
};

const updateUserSingleValue = async (username, updateKey, updateValue) => {
  await User.updateOne({ username }, { [updateKey]: updateValue });
};

const updateUserMultipleValues = async (username, updateObj) => {
  await User.updateMany({ username }, updateObj);
};

const deleteUser = async (username) => {
  await User.deleteOne({ username });
};

module.exports = {
  getAllLatestChats,
  addMsgToChat,
  createChat,
  getChatInfoByChatId,
  getUsersOnSearch,
  getUsernamesByChatId,
  deleteMsgs,
  updateUserSingleValue,
  updateUserMultipleValues,
  deleteUser
};
