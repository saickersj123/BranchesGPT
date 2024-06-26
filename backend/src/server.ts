import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/UserRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";

import { config } from "dotenv";

config();

const app = express();

// Middlewares

app.use(cors({origin:true, credentials: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev")); // for development

// routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);

// Connections and Listeners
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.z3bws8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log(
      `Server started on port ${process.env.PORT || 5000} and Mongo DB is connected`
    );
  })
  .catch((err) => {
    console.log(err);
  });
