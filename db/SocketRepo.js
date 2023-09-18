const Chat = require("../model/Chat");
const { deleteNullUndefinedFromObj } = require("../utils/Utility");

const getAllChatIds = async () => {
  return await Chat.find({}).populate("chatId").exec();
};

const addMsgToChat = async (chatId, msgObj) => {
  const msgPayload = {
    sender: msgObj.sender,
    msg: msgObj.msg,
    type: msgObj.type,
    sentAt: msgObj.sentAt,
    seenBy: [msgObj.sender],
  };
  deleteNullUndefinedFromObj(msgPayload);
  await Chat.updateOne({ chatId }, { $push: { msgs: msgPayload } });
};

const updateMsgInfo = async (chatId, updateObj) => {
  const { key, value, msgId } = updateObj;
  await Chat.updateOne(
    { chatId },
    { $set: { [`msgs.$[msgObj].${key}`]: value } },
    { arrayFilters: [{ [`msgObj.msgId`]: { $eq: msgId } }] }
  );
};

module.exports = { getAllChatIds, addMsgToChat, updateMsgInfo };
