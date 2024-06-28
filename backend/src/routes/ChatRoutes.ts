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
	"/new",
	validate(chatCompletionValidator),
	verifyToken,
	startNewConversation,
	generateChatCompletion
);

//resume conversation
chatRoutes.post(
	"/conversation/:conversationId",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion
);

//get all conversations
chatRoutes.get(
	"/all-conversations",
	verifyToken,
	getAllConversations
);

//get a conversation
chatRoutes.get(
	"/conversation/:conversationId",
	verifyToken,
	getConversation
);

//delete a conversation
chatRoutes.delete(
    "/delete-conversations/:conversationId",
    verifyToken,
    deleteConversation
)

//delete all conversations
chatRoutes.delete(
    "/delete-all-conversations",
    verifyToken,
    deleteAllConversatoins
)

export default chatRoutes;
