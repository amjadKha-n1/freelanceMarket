const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

const protect = require("../middlewares/isAuth");

router.post(
  "/start-conversation",
  protect,
  messageController.startConversation
);
router.get("/my-conversations", protect, messageController.getMyConversations);

router.post("/send-message", protect, messageController.sendMessage);
router.get("/:conversationId", protect, messageController.getMessage);

module.exports = router;
