if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://eyougle.vercel.app/', //! Adjust this to your frontend URL
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 3000;
const errorHandler = require('./middlewares/errorHandler');
const AuthController = require('./controller/AuthController');
const auth = require('./middlewares/authentication');
const socketIo = require('./helpers/socketio');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/register', AuthController.Register);
app.post('/login', AuthController.Login);
app.use(auth);
app.use(errorHandler);

socketIo(io)

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
