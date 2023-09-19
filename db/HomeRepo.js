const Chat = require("../model/Chat");
const User = require("../model/User");
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

const getChatInfoByChatId = async (username, chatId, pageNo) => {
  //update the seenBy
  await markAllMsgsSeen(username, chatId);
  //check if user is of new chat (i.e. 0 msgs)
  const chatInfo = await Chat.findOne({ chatId }).exec();
  let msgs = [];
  if (chatInfo?.msgs?.length) {
    //if user has more than 0 msgs in the chat
    const res = (
      await Chat.aggregate([
        { $match: { chatId, usernames: username } },
        { $unwind: "$msgs" },
        { $sort: { "msgs.sentAt": -1 } },
        {
          $group: {
            _id: "$_id",
            chatId: { $first: "$chatId" },
            usernames: { $first: "$usernames" },
            msgs: { $push: "$msgs" },
          },
        },
        {
          $project: {
            _id: "$_id",
            chatId: "$chatId",
            usernames: "$usernames",
            msgs: { $slice: ["$msgs", pageNo * 10, 10] },
          },
        },
      ])
    )?.[0];
    msgs = res?.msgs;
  }
  const otherUsersInfo = chatInfo?.usernames?.filter(
    (uname) => uname !== username
  );
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
      seenBy: msgObj?.seenBy,
    })),
  };
};

const getUsernamesByChatId = async (chatId) => {
  const { usernames } = (await Chat.find({ chatId }).exec())?.[0];
  return usernames;
};

const getUsersOnSearch = async (username, searchkey) => {
  if (!searchkey) return [];
  const users = await User.find({
    $and: [
      { username: { $ne: username } },
      { accountActive: true },
      {
        $or: [
          { username: { $regex: searchkey, $options: "i" } },
          { fullName: { $regex: searchkey, $options: "i" } },
        ],
      },
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

const deactivateUser = async (username) => {
  await User.updateOne({ username }, { $set: { accountActive: false } });
};

const activateUser = async (username) => {
  await User.updateOne({ username }, { $set: { accountActive: true } });
};

const markAllMsgsSeen = async (username, chatId) => {
  await Chat.updateMany(
    { chatId },
    { $push: { "msgs.$[ele].seenBy": username } },
    { arrayFilters: [{ "ele.seenBy": { $ne: username } }] }
  );
};

module.exports = {
  getAllLatestChats,
  createChat,
  getChatInfoByChatId,
  getUsersOnSearch,
  getUsernamesByChatId,
  deleteMsgs,
  updateUserSingleValue,
  updateUserMultipleValues,
  deactivateUser,
  activateUser,
  markAllMsgsSeen,
};
