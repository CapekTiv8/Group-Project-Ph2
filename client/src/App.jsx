import { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

//! change domain for server here later when deployed
const socket = io('http://localhost:3000');

function App() {
  const [text, setText] = useState('');
  const [chats, setChats] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // prevent empty message sent
      if (!text.trim()) return;

      // chat:message 1. send message to server
      socket.emit('chat:message', text);
      console.log(text);

      //set text to empty after emit
      setText('');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // chat:message 5. receive messages from server
    socket.on('chat:message', (chats) => {
      setChats(chats);
    });
    // chat:message 7. fetch initial messages from server
    socket.emit('chat:fetch');
  }, []);

  return (
    <>
      <ul id="messages">
        {chats.map((chat, index) => {
          return <li key={index}>{chat}</li>;
        })}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          autoComplete="off"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <button>Send</button>
      </form>
    </>
  );
}

export default App;
//! can be moved into a proper routing file later when more pages are added