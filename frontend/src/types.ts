export interface Message {
  content: string;
  role: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  chats: Message[];
  createdAt: string;
}