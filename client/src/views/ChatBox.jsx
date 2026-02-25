import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { useAuth } from '../context/LoginContext';

const socket = io('https://group-project-ph2-production.up.railway.app');

export default function ChatBox() {
  const [text, setText] = useState('');
  const [chats, setChats] = useState([]);
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | waiting | matched
  const username = useContext(useAuth()).user.username;
  const navigate = useNavigate();

  function findPartner() {
    socket.emit('find:partner');
    setStatus('waiting');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (!text.trim()) return;
      socket.emit('chat:message', {
        room,
        username,
        text,
        timestamp: new Date().toLocaleTimeString(),
      });
      setText('');
    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    localStorage.clear();
    navigate('/login')
  }

  useEffect(() => {
    socket.on('waiting', () => {
      setStatus('waiting');
    });

    socket.on('matched', ({ room }) => {
      setRoom(room);
      setStatus('matched');
      setChats([]);
    });

    socket.on('partner:left', () => {
      setStatus('idle');
      setRoom(null);
      setChats([]);

      // cari partner baru
      socket.emit('find:partner');
      setStatus('waiting')
    });

    socket.on('chat:message', (chats) => {
      setChats(chats);
    });

    return () => {
      socket.off('waiting');
      socket.off('matched');
      socket.off('partner:left');
      socket.off('chat:message');
    };
  }, []);

  if (status === 'idle') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#030303]">
        <div className="absolute -top-10 right-10 w-[72%] h-12 bg-gray-500 rounded-full opacity-90 blur-[100px]" />
        <div className="absolute bottom-8 -left-10 w-[72%] h-8 bg-blue-500 rounded-full opacity-90 blur-[100px]" />
        <h1 className="text-white text-2xl font-bold mb-2">Random Chat</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Terhubung dengan orang asing secara acak
        </p>
        <button
          onClick={findPartner}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-md font-semibold"
        >
          Cari Partner
        </button>
        <button
          onClick={logout}
          className="text-white hover:underline cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }


  if (status === 'waiting') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#030303]">
        <div className="absolute -top-10 right-10 w-[72%] h-12 bg-gray-500 rounded-full opacity-90 blur-[100px]" />
        <div className="absolute bottom-8 -left-10 w-[72%] h-8 bg-blue-500 rounded-full opacity-90 blur-[100px]" />
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-zinc-300 text-lg">Mencari partner...</p>
        <button
          onClick={() => {
            setStatus('idle');
          }}
          className="mt-6 text-zinc-500 hover:text-zinc-300 text-sm transition"
        >
          Batalkan
        </button>
      </div>
    );
  }


  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col bg-[#030303] max-w-screen max-h-screen pb-16 border border-zinc-300 border-opacity-30 rounded-md relative p-5 w-full h-screen justify-between overflow-y-auto overflow-x-hidden">

        {/* Background Blur */}
        <div className="absolute -top-10 -right-10 w-[72%] h-12 bg-gray-500 rounded-full opacity-90 blur-[100px]" />
        <div className="absolute -bottom-10 -left-10 w-[72%] h-8 bg-blue-500 rounded-full opacity-90 blur-[100px]" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-zinc-300 text-sm">Partner ditemukan</span>
          </div>
          <button
            onClick={() => {
              socket.emit('leave:room', room); // notify server & partner
              setRoom(null);
              setChats([]);
              setStatus('idle'); // yang klik tombol balik ke idle
            }}
            className="text-zinc-500 hover:text-red-400 text-sm transition"
          >
            Tinggalkan Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-col w-full mb-12">
          {chats.length === 0 && (
            <p className="text-zinc-600 text-sm text-center mt-10">
              Mulai percakapan! Ketik @AI untuk mengobrol dengan AI.
            </p>
          )}
          {chats.map((chat, index) => {
            const sender = chat.username;
            const message = chat.text;
            const date = chat.timestamp;
            const isMe = username === sender;
            const isAI = sender === 'AI';

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
                    src={
                      isAI
                        ? 'https://github.com/anthropics.png?size=56'
                        : 'https://github.com/mojombo.png?size=56'
                    }
                    className="h-12 w-12 border border-zinc-300 border-opacity-50 rounded-full mr-3 opacity-90"
                  />
                )}

                {/* Bubble */}
                <div
                  className={`w-100 min-h-14 border rounded-md flex items-center px-3 py-2 relative ${
                    isAI
                      ? 'bg-blue-950 border-blue-700 border-opacity-50 text-blue-200'
                      : 'bg-[#030303] border-zinc-300 border-opacity-30 text-zinc-300'
                  }`}
                >
                  <span>
                    <span className="font-semibold text-white">{sender}:</span>{' '}
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
          className="flex gap-3 border-t border-zinc-700 pt-4 fixed bottom-5 left-10 right-10 rounded-2xl px-2"
        >
          <input
            autoComplete="off"
            onChange={(event) => setText(event.target.value)}
            value={text}
            placeholder="Type a message... (ketik @AI untuk tanya AI)"
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