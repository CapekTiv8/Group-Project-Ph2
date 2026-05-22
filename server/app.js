if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);

const allowedOrigins = ["http://localhost:5173", "https://eyougle.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 3012;
const errorHandler = require("./middlewares/errorHandler");
const AuthController = require("./controller/AuthController");
const RoomController = require("./controller/RoomController");
const auth = require("./middlewares/authentication");
const socketIo = require("./helpers/socketio");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", AuthController.Register);
app.post("/login", AuthController.Login);

app.use(auth);
app.post("/rooms", RoomController.createRoom);

app.use(errorHandler);

socketIo(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
