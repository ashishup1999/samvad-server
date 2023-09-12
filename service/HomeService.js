const { getUserInfo } = require("../db/CommonRepo");
const {
  getAllLatestChats,
  addMsgToChat,
  createChat,
} = require("../db/HomeRepo");

const GetAllLatestChats = async (req, res) => {
  try {
    const { username } = req.params;
    const allLatestChats = await getAllLatestChats(username);
    const result = [];
    for (let i = 0; i < allLatestChats.length; i++) {
      const obj = allLatestChats[i];
      const userInfo = await getUserInfo(obj?.otherUser);
      const { msgId, msg, sender, sentAt } = obj?.lastMsg;
      result.push({
        chatId: obj?.chatId,
        lastMsg: { msgId, msg, sender, sentAt },
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
    const { usernames } = req.body;
    await createChat(usernames);
    res.send({ status: "SUCCESS" });
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR" });
  }
};

const AddMsgToChat = async (req, res) => {
  try {
    const { chatId, msgObj } = req.body;
    await addMsgToChat(chatId, msgObj);
    res.send({ status: "SUCCESS" });
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR" });
  }
};

const GetUserInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const { fullName, email } = await getUserInfo(username);
    res.send({ fullName, email });
  } catch {
    console.log(error);
    res.send({ status: "ERROR", message: "Unable to fetch the user" });
  }
};

module.exports = {
  GetAllLatestChats,
  CreateChat,
  AddMsgToChat,
  GetUserInfo,
};
