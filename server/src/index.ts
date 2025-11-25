import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { CLIENT_URL, PORT } from "./constants";
import { socketEventsHandlers } from "./socketEventsHandlers";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socketEventsHandlers(io, socket);
});

httpServer.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
