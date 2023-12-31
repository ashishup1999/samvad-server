const {
  deleteNullUndefinedFromObj,
  isObjectEmpty,
} = require("../utils/Utility");
const User = require("../model/User");
const Otp = require("../model/Otp");

const addUser = async ({ fullName, email, username, password, profileImg }) => {
  await User.create({ fullName, email, username, password, profileImg });
};

const updateUser = async (email, updateKey, updateValue) => {
  await User.updateOne({ email }, { [updateKey]: updateValue });
};

const getUser = async (key, value) => {
  const userObj = await User.findOne({
    [key]: value,
  }).exec();
  const payload = {
    username: userObj?.username,
    email: userObj?.email,
    password: userObj?.password,
    fullName: userObj?.fullName,
    profileImg: userObj?.profileImg,
    accountActive: userObj?.accountActive
  };
  deleteNullUndefinedFromObj(payload);
  return isObjectEmpty(payload) && payload;
};

const createOTP = async (email) => {
  const alereadyOtp = await Otp.findOne({ email }).exec();
  const otp = Math.floor(100000 + Math.random() * 900000);
  if (alereadyOtp) {
    await Otp.updateOne({ email }, { otp });
    return otp;
  }
  await Otp.create({ email, otp });
  return otp;
};

const getOTP = async (email) => {
  return (await Otp.findOne({ email }).exec())?.otp;
};

module.exports = {
  addUser,
  updateUser,
  getUser,
  createOTP,
  getOTP,
};
