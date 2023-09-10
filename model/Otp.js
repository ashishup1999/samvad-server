const mongoose = require("mongoose");
const { DB_COLLECTIONS } = require("../constants/CommonConstants");
const { Schema, model } = mongoose;

const OtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
  },
  { timestamps: true }
);

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = model(DB_COLLECTIONS.OTPS, OtpSchema);
