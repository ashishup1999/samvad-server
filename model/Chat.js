const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { DB_COLLECTIONS } = require("../constants/CommonConstants");
const moment = require("moment/moment");
const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  chatId: { type: String, default: uuidv4 },
  usernames: [{ type: String }],
  msgs: {
    type: [
      {
        msgId: { type: String, default: uuidv4 },
        msg: { type: String },
        sender: { type: String },
        type: { type: String, default: "text" },
        deletedFor: { type: Array, default: [] },
        seenBy: { type: Array, default: [] },
        sentAt: { type: Date },
        deliveredAt: { type: Date },
        seenAt: { type: Date },
      },
    ],
    default: [],
  },
});

module.exports = model(DB_COLLECTIONS.CHATS, ChatSchema);
