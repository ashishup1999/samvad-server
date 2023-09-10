require("dotenv").config();
const CryptoJS = require("crypto-js");
const encryptionKey = process.env.ENCRYPTION_SECRET_KEY;

const encryptData = (value) => {
  return CryptoJS.AES.encrypt(value, encryptionKey).toString();
};

const decryptData = (value) => {
  return CryptoJS.AES.decrypt(value, encryptionKey).toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptData, decryptData };
