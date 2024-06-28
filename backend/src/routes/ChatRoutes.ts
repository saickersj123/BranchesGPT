import express from "express";
import { verifyToken } from "../utils/Token.js";
import { chatCompletionValidator, validate } from "../utils/Validators.js";
import { deleteConversation, 
		 getConversation, 
		 deleteAllConversatoins, 
		 generateChatCompletion, 
		 getAllConversations, 
		 startNewConversation } from "../controllers/ChatController.js";
 
const chatRoutes = express.Router();

// test
chatRoutes.get("/", (req, res, next) => {
	console.log("hi");
	res.send("hello from chatRoutes");
});

// protected API
//new conversation
chatRoutes.post(
	"/c/new",
	validate(chatCompletionValidator),
	verifyToken,
	startNewConversation,
	generateChatCompletion
);

//resume conversation
chatRoutes.post(
	"/c/:conversationId",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion
);

//get all conversations
chatRoutes.get(
	"/all-c",
	verifyToken,
	getAllConversations
);

//get a conversation
chatRoutes.get(
	"/c/:conversationId",
	verifyToken,
	getConversation
);

//delete a conversation
chatRoutes.delete(
    "/delete-c/:conversationId",
    verifyToken,
    deleteConversation
)

//delete all conversations
chatRoutes.delete(
    "/delete-all-c",
    verifyToken,
    deleteAllConversatoins
)

export default chatRoutes;
