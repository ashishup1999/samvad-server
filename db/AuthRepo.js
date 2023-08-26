const { clientDB } = require("../dbConn");
const {
  deleteNullUndefinedFromObj,
  isObjectEmpty,
} = require("../utils/Utility");
const { USER_QUERY } = require("./queries/user");

const addUser = async ({ fullname, email, username, password }) => {
  await clientDB.query(USER_QUERY.ADD_USER, [
    fullname,
    email,
    username,
    password,
  ]);
  const userId = (await clientDB.query(USER_QUERY.GET_USERID, [username]))
    ?.rows?.[0]?.user_id;
  return userId;
};

const updateUser = async (userId, updateKey, updateValue) => {
  await clientDB.query(USER_QUERY[`UPDATE_${updateKey.toUpperCase()}`], [
    userId,
    updateValue,
  ]);
};

const getUser = async (key, value) => {
  const userObj = (
    await clientDB.query(USER_QUERY[`GET_USER_BY_${key.toUpperCase()}`], [
      value,
    ])
  )?.rows?.[0];
  const payload = {
    userId: userObj?.user_id,
    username: userObj?.username,
    email: userObj?.email,
    password: userObj?.password,
    fullName: userObj?.fullname,
  };
  deleteNullUndefinedFromObj(payload);
  return isObjectEmpty(payload) && payload;
};

const deleteUser = async (userId) => {
  await clientDB.query(USER_QUERY.DELETE_USER, [userId]);
};

const createOTP = async (email) => {
  const alereadyOtp = await clientDB.query(USER_QUERY.GET_OTP, [email])
    ?.rows?.[0]?.otp;
  const otp = Math.floor(100000 + Math.random() * 900000);
  if (alereadyOtp) {
    await clientDB.query(USER_QUERY.UPDATE_OTP, [email, otp]);
    return otp;
  }
  await clientDB.query(USER_QUERY.CREATE_OTP, [email, otp]);
  return otp;
};

const getOTP = async (email) => {
  // console.log(await clientDB.query(USER_QUERY.GET_OTP, [email]))
  return (await clientDB.query(USER_QUERY.GET_OTP, [email]))?.rows?.[0]?.otp;
};

module.exports = {
  addUser,
  updateUser,
  getUser,
  deleteUser,
  createOTP,
  getOTP,
};
