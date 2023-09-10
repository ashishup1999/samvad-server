const Chat = require("../model/Chat");

const getAllLatestChats = async (username) => {
  const allLatestChats = await Chat.aggregate([
    {
      $group: {
        _id: { sender: "$sender", receiver: "$receiver" },
        chatId: { $first: "$chatId" },
        createdAt: { $first: "$createdAt" },
        sender: { $first: "$sender" },
        receiver: { $first: "$receiver" },
        msg: { $first: "$msg" },
        seen: { $first: "$seen" },
      },
    },
    { $match: { $or: [{ sender: username }, { receiver: username }] } },
    { $sort: { createdAt: -1 } },
  ]).exec();
  const visitedUser = {};
  const result = [];
  allLatestChats?.forEach((obj, idx) => {
    if (
      (obj?.sender === username && visitedUser[obj?.receiver] === true) ||
      (obj?.receiver === username && visitedUser[obj?.sender] === true)
    ) {
      allLatestChats[idx] = null;
    } else if (obj?.sender === username) {
      result.push(obj);
      visitedUser[obj?.receiver] = true;
    } else if (obj?.receiver === username) {
      result.push(obj);
      visitedUser[obj?.sender] = true;
    }
  });
  return result;
};

const createChat = async (sender, receiver, msg) => {
  await Chat.create({ sender, receiver, msg });
};

module.exports = {
  getAllLatestChats,
  createChat,
};
