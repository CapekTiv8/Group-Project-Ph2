require('dotenv').config();
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', //! Adjust this to your frontend URL
    methods: ['GET', 'POST'],
  },
});

const port = 3000;
const errorHandler = require('./middlewares/errorHandler');
const AuthController = require('./controller/AuthController');
const auth = require('./middlewares/authentication');
const { Message, Room } = require('./models');
const AiController = require('./controller/AiController');

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

let chats = []; // This will hold all chat messages in memory (for demonstration purposes)
// Socket.IO connection handler
io.on('connection', async (socket) => {
  console.log('user connected', socket.id);

  // chat:message 2. receive message from client
  socket.on('chat:message', async (msg) => {
    console.log(msg);
    // chat:message 3. save message to database (here we just push to an array for demonstration)
    chats.push(msg); //!change this to save in database
    if (msg.text.includes('@AI')) {
      // const response = await AiController.respond(msg)
      const formattedMessages = chats.map(e => {
        return `${e.username}: ${e.text}`;
      })

      let response = await AiController.getReply(formattedMessages, msg);
      chats.push({username: 'AI', text: response, timestamp: new Date()});
      console.log(response)
    }
    // chat:message 4. Broadcast all messages to all connected clients
    io.emit('chat:message', chats);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });

  socket.emit('chat:message', chats); // chat:message 6. Send existing chats to the newly connected client
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
