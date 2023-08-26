const express = require("express");
const router = express.Router();
const {
  AuthenticateUser,
  SignUpUser,
  SendVerificationCode,
  VerifyOtp,
  UpdateUserPassword,
} = require("../service/AuthService");

router.post("/login", AuthenticateUser);
router.post("/signUp", SignUpUser);
router.post("/sendVerificationCode", SendVerificationCode);
router.post("/verifyOtp", VerifyOtp);
router.post("/updatePassword", UpdateUserPassword);

module.exports = router;
