const express = require("express");
const router = express.Router();
const {
  GetAllLatestChats,
  CreateChat,
  GetUserInfo,
  AddMsgToChat,
} = require("../service/HomeService");

router.get("/getAllChats/:username", GetAllLatestChats);
router.post("/createChat", CreateChat);
router.post("/addMsgToChat", AddMsgToChat);
router.get("/getUserInfo/:username", GetUserInfo);

module.exports = router;
