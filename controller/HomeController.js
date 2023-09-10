const express = require("express");
const router = express.Router();
const { GetAllLatestChats, CreateChat } = require("../service/HomeService");

router.get("/getAllChats/:username", GetAllLatestChats);
router.post("/createChat", CreateChat);

module.exports = router;
