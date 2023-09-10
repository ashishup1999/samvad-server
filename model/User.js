const mongoose = require("mongoose");
const { DB_COLLECTIONS } = require("../constants/CommonConstants");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model(DB_COLLECTIONS.USERS, UserSchema);
