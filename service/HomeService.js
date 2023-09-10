const { getUserInfo } = require("../db/CommonRepo");
const { getAllLatestChats, createChat } = require("../db/HomeRepo");

const GetAllLatestChats = async (req, res) => {
  try {
    const { username } = req.params;
    const allLatestChats = await getAllLatestChats(username);
    const result = [];
    for (let i = 0; i < allLatestChats.length; i++) {
      const obj = allLatestChats[i];
      const userInfo = await getUserInfo(
        obj?.sender === username ? obj?.receiver : obj?.sender
      );
      result.push({
        lastMsg: {
          chatId: obj?.chatId,
          message: obj?.msg,
          createdAt: obj?.createdAt,
          type: obj?.sender === username ? "receiver" : "sender",
          seen: obj?.seen,
        },
        ...userInfo,
      });
    }
    res.send({ status: "SUCCESS", chats: result });
  } catch (error) {
    res.send({ status: "ERROR" });
  }
};

const CreateChat = async (req, res) => {
  try {
    const { sender, receiver, msg } = req.body;
    await createChat(sender, receiver, msg);
    res.send({ status: "SUCCESS" });
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR" });
  }
};

module.exports = {
  GetAllLatestChats,
  CreateChat,
};
