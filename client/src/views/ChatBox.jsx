import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { io } from 'socket.io-client';

//! change domain for server here later when deployed
const socket = io('http://localhost:3000');

export default function ChatBox() {
  const [text, setText] = useState('');
  const [chats, setChats] = useState([]);
  const location = useLocation();
  const username = localStorage.getItem('username');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // prevent empty message sent
      if (!text.trim()) return;

      // chat:message 1. send message to server
      socket.emit('chat:message', {username, text, timestamp: new Date().toLocaleTimeString()});
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
  }, [location]);


  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col bg-[#030303] w-[900px] m-6 my-12 pb-16 border border-zinc-300 border-opacity-30 rounded-md relative overflow-hidden p-5">
  
        {/* Background Blur */}
        <div className="absolute -top-10 -right-10 w-[72%] h-12 bg-gray-500 rounded-full opacity-90 blur-[100px]" />
        <div className="absolute -bottom-10 -left-10 w-[72%] h-8 bg-blue-500 rounded-full opacity-90 blur-[100px]" />
  
        <div className="flex flex-col w-full">
          {chats.map((chat, index) => {
            const sender = chat.username;
            const message = chat.text;
            const date = chat.timestamp;
            const isMe = username === sender;
  
            return (
              <div
                key={index}
                className={`flex items-center mt-8 ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Avatar kiri */}
                {!isMe && (
                  <img
                    src="https://github.com/mojombo.png?size=56"
                    className="h-12 w-12 border border-zinc-300 border-opacity-50 rounded-full mr-3 opacity-90"
                  />
                )}
  
                {/* Bubble */}
                <div className="w-[400px] min-h-[56px] bg-[#030303] border border-zinc-300 border-opacity-30 rounded-md flex items-center px-3 py-2 text-zinc-300 relative">
                  <span>
                    <span className="font-semibold text-white">
                      {sender}:
                    </span>{' '}
                    {message}
                  </span>
  
                  <div
                    className={`absolute -bottom-6 text-zinc-600 text-xs ${
                      isMe ? 'right-0' : 'left-0'
                    }`}
                  >
                    {date}
                  </div>
                </div>
  
                {/* Avatar kanan */}
                {isMe && (
                  <img
                    src="https://github.com/thomas5.png?size=56"
                    className="h-12 w-12 border border-zinc-300 border-opacity-50 rounded-full ml-3 opacity-90"
                  />
                )}
              </div>
            );
          })}
        </div>
  
        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 flex gap-3 border-t border-zinc-700 pt-4"
        >
          <input
            autoComplete="off"
            onChange={(event) => setText(event.target.value)}
            value={text}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-md border border-zinc-700 focus:outline-none"
          />
          <button className="bg-blue-600 px-5 py-2 rounded-md text-white hover:bg-blue-700 transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

