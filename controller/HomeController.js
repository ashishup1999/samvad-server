const express = require("express");
const router = express.Router();
const {
  GetAllLatestChats,
  CreateChat,
  GetUserInfo,
  AddMsgToChat,
  GetChatInfoByChatId,
  GetUsersOnSearch,
} = require("../service/HomeService");

router.get("/getAllChats/:username", GetAllLatestChats);
router.post("/createChat", CreateChat);
router.post("/addMsgToChat", AddMsgToChat);
router.get("/getUserInfo/:username", GetUserInfo);
router.get("/getChatInfoByChatId/:username", GetChatInfoByChatId);
router.get("/getUsersOnSearch/:username", GetUsersOnSearch);

module.exports = router;
