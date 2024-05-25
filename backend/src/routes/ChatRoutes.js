const express = require('express');
const { verifyToken } = require('../utils/Token');
const { chatCompletionValidator, validate } = require('../utils/Validators');
const { deleteAllChats, generateChatCompletion, getAllChats } = require('../controllers/ChatController');

const chatRoutes = express.Router();

// test
chatRoutes.get("/", (res) => {
	console.log("hi");
	res.send("hello from chatRoutes");
});

// protected API

chatRoutes.post(
	"/new",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion
);

chatRoutes.get(
	"/all-chats",
	verifyToken,
	getAllChats
);

chatRoutes.delete(
    "/delete-all-chats",
    verifyToken,
    deleteAllChats
);

module.exports = chatRoutes;
