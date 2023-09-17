const User = require("../model/User");

const getUserInfo = async (username) => {
  const userInfo = await User.findOne({ username }).exec();
  return {
    username: userInfo?.username,
    fullName: userInfo?.fullName,
    email: userInfo?.email,
    profileImg: userInfo?.profileImg,
  };
};

module.exports = {
  getUserInfo,
};
