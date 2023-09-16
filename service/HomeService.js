const { getUserInfo } = require("../db/CommonRepo");
const {
  getAllLatestChats,
  addMsgToChat,
  createChat,
  getChatInfoByChatId,
  getUsersOnSearch,
  getUsernamesByChatId,
  deleteMsgs,
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
    const chatId = await createChat(usernames);
    res.send({ status: "SUCCESS", chatId });
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
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR", message: "Unable to fetch the user" });
  }
};

const GetChatInfoByChatId = async (req, res) => {
  try {
    const { username } = req.params;
    const { chatId } = req.query;
    const result = await getChatInfoByChatId(username, chatId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "unable to fetch usersInfo at the moment",
    });
  }
};

const GetUsernamesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const usernames = await getUsernamesByChatId(chatId);
    res.send({ usernames });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "unable to fetch usersInfo at the moment",
    });
  }
};

const GetUsersOnSearch = async (req, res) => {
  try {
    const { username } = req.params;
    const { search } = req.query;
    const result = await getUsersOnSearch(username, search);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "unable to search users at the moment",
    });
  }
};

const DeleteMsgs = async (req, res) => {
  try {
    const { chatId, msgIds } = req.body;
    await deleteMsgs(chatId, msgIds);
    res.send({ status: "SUCCESS", message: "Message deleted Successfuly" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "unable to delete message at the moment",
    });
  }
};

module.exports = {
  GetAllLatestChats,
  CreateChat,
  AddMsgToChat,
  GetUserInfo,
  GetChatInfoByChatId,
  GetUsersOnSearch,
  GetUsernamesByChatId,
  DeleteMsgs,
};
