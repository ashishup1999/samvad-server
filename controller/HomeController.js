const express = require("express");
const router = express.Router();
const {
  GetAllLatestChats,
  CreateChat,
  GetUserInfo,
  GetChatInfoByChatId,
  GetUsersOnSearch,
  GetUsernamesByChatId,
  DeleteMsgs,
  UpdateSingleValue,
  UpdateMultipleValues,
  DeactivateUser,
  MarkAllMsgsSeen,
} = require("../service/HomeService");

router.get("/getAllChats/:username", GetAllLatestChats);
router.post("/createChat", CreateChat);
router.get("/getUserInfo/:username", GetUserInfo);
router.get("/getChatInfoByChatId/:username", GetChatInfoByChatId);
router.get("/getUsersOnSearch/:username", GetUsersOnSearch);
router.get("/getUsernamesByChatId/:chatId", GetUsernamesByChatId);
router.post("/deleteMsgs", DeleteMsgs);
router.post("/updateUserSingleValue", UpdateSingleValue);
router.post("/updateUserMultipleValues", UpdateMultipleValues);
router.get("/deactivateUser/:username", DeactivateUser);
router.get("/markAllMsgsSeen/:username", MarkAllMsgsSeen);

module.exports = router;
