const { getUserInfo } = require("../db/CommonRepo");
const {
  getAllLatestChats,
  createChat,
  getChatInfoByChatId,
  getUsersOnSearch,
  getUsernamesByChatId,
  deleteMsgs,
  updateUserSingleValue,
  updateUserMultipleValues,
  deactivateUser,
  markAllMsgsSeen,
} = require("../db/HomeRepo");
const { encryptData } = require("../utils/Encryption");

const GetAllLatestChats = async (req, res) => {
  try {
    const { username } = req.params;
    const allLatestChats = await getAllLatestChats(username);
    const result = [];
    for (let i = 0; i < allLatestChats.length; i++) {
      const obj = allLatestChats[i];
      const userInfo = await getUserInfo(obj?.otherUser);
      const { msgId, msg, sender, sentAt, seenBy } = obj?.lastMsg;
      result.push({
        chatId: obj?.chatId,
        lastMsg: { msgId, msg, sender, sentAt, seenBy },
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

const GetUserInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const { fullName, email, profileImg } = await getUserInfo(username);
    res.send({ fullName, email, profileImg });
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR", message: "Unable to fetch the user" });
  }
};

const GetChatInfoByChatId = async (req, res) => {
  try {
    const { username } = req.params;
    const { chatId, pageNo } = req.query;
    const result = await getChatInfoByChatId(username, chatId, pageNo);
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
    res.send({ usernames: usernames?.map((uname) => encryptData(uname)) });
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
    const result = await getUsersOnSearch(username, search?.toLowerCase());
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
    const { username, chatId, msgIds } = req.body;
    await deleteMsgs(username, chatId, msgIds);
    res.send({ status: "SUCCESS", message: "Messages deleted Successfuly" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "unable to delete messages at the moment",
    });
  }
};

const UpdateSingleValue = async (req, res) => {
  try {
    const { username, key, value } = req.body;
    await updateUserSingleValue(username, key, value);
    res.send({ status: "SUCCESS", message: "Message updated Successfuly" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "Unable to update",
    });
  }
};

const UpdateMultipleValues = async (req, res) => {
  try {
    const { username, updateDetails } = req.body;
    await updateUserMultipleValues(username, updateDetails);
    res.send({ status: "SUCCESS", message: "Message updated Successfuly" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "Unable to update",
    });
  }
};

const DeactivateUser = async (req, res) => {
  try {
    const { username } = req.params;
    await deactivateUser(username);
    res.send({ status: "SUCCESS", message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "Unable to delete user",
    });
  }
};

const MarkAllMsgsSeen = async (req, res) => {
  try {
    const { username } = req.params;
    const { chatId } = req.query;
    await markAllMsgsSeen(username, chatId);
    res.send({ status: "SUCCESS", message: "Seen status updated" });
  } catch (error) {
    console.log(error);
    res.send({
      status: "ERROR",
      message: "Unable to update seen status",
    });
  }
};

module.exports = {
  GetAllLatestChats,
  CreateChat,
  GetUserInfo,
  GetChatInfoByChatId,
  GetUsersOnSearch,
  GetUsernamesByChatId,
  DeleteMsgs,
  UpdateSingleValue,
  UpdateMultipleValues,
  DeactivateUser,
  MarkAllMsgsSeen,
};
