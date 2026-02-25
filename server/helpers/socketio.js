const AiController = require('../controller/AiController');

function socketIo(io) {
  let waitingUser = null; // Waiting user for pairing
  const roomChats = {};

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('find:partner', () => {
      if (waitingUser && waitingUser.id !== socket.id) {
        // pair the users together
        const room = `room-${waitingUser.id}-${socket.id}`;

        socket.join(room);
        waitingUser.join(room);

        roomChats[room] = []; // initialize chat history for the room

        io.to(room).emit('matched', { room });

        waitingUser = null; // reset waiting user
      } else {
        waitingUser = socket; // set current user as waiting
        socket.emit('waiting'); // notify user to wait for partner
      }
    });

    // chat:message 2. receive message from client
    socket.on('chat:message', async ({ room, username, text }) => {
      if (!room || !roomChats[room]) return; // if room doesn't exist, ignore the message
      console.log(username, text, room);
      const msg = {
        username,
        text,
        timestamp: new Date().toLocaleTimeString(),
      };
      roomChats[room].push(msg); // save message to the room's chat history
      // chat:message 3. save message to database (here we just push to an array for demonstration)
      if (msg.text.includes('@AI')) {
        // const response = await AiController.respond(msg)
        const formattedMessages = roomChats[room].map((e) => {
          return `${e.username}: ${e.text}`;
        });

        let response = await AiController.getReply(formattedMessages, msg);
        try {
          roomChats[room].push({
            username: 'AI',
            text: response,
            timestamp: new Date(),
          });
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
      // chat:message 4. Broadcast all messages to all connected clients
      io.to(room).emit('chat:message', roomChats[room]);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);

      if (waitingUser?.id === socket.id) {
        waitingUser = null; // reset waiting user if they disconnect
      }

      //find room user was in
      const rooms = [...socket.rooms];

      rooms.forEach((room) => {
        if (room !== socket.id) {
          // ignore the socket's own room)
          socket.to(room).emit('partner:left'); // notify partner that user has left
          delete roomChats[room]; // delete the room's chat history
        }
      });
    });

    socket.on('leave:room', (room) => {
      const rooms = [...socket.rooms];
      rooms.forEach((r) => {
        if (r !== socket.id) {
          socket.to(r).emit('partner:left');
          delete roomChats[r];
        }
      });
      socket.leave(room);
    });

    //   socket.emit('chat:message', chats); // chat:message 6. Send existing chats to the newly connected client
    // });
  });
}

module.exports = socketIo;
