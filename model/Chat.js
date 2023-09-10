const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { DB_COLLECTIONS } = require("../constants/CommonConstants");
const { Schema, model } = mongoose;

const ChatSchema = new Schema(
  {
    chatId: { type: String, default: uuidv4 },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    msg: String,
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model(DB_COLLECTIONS.CHATS, ChatSchema);
