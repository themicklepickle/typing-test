import Head from 'next/head';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
  const [gameState, setGameState] = useState({});
  const [text, setText] = useState('');
  const [socket, setSocket] = useState();

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log(socket.id);
      console.log('admin connected');
      socket.emit('register-admin');
    });

    socket.on('update-game-state', (newGameState) => {
      setGameState(newGameState);
    });

    socket.on('update-text', (newText) => {
      setText(newText);
    });
  }, [socket]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    setSocket(io());
  };

  const start = () => {
    if (socket) socket.emit('start');
  };

  const generateNewText = () => {
    if (socket) socket.emit('generate-new-text');
  };

  const reset = () => {
    if (socket) socket.emit('reset');
  };

  const kick = (id) => {
    if (socket) socket.emit('kick', id);
  };

  const players = Object.values(gameState).sort((a, b) => {
    if (!a.progress.percentage) return 10000000;
    return b.progress.percentage - a.progress.percentage;
  });

  return (
    <div>
      <Head>
        <title>Admin Panel</title>
        <meta property="og:title" content="Admin Panel" key="title" />
      </Head>

      <main className="select-none">
        <div className="grid h-screen place-content-center">
          <div className="flex flex-col h-screen w-screen max-w-3xl p-8">
            <div className="flex-auto h-max">
              <Leaderboard players={players} kick={kick} />
            </div>
            <div className="flex flex-col h-2/5">
              <h1 className="text-xl mb-4">{text}</h1>
              <button
                onClick={generateNewText}
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate New Text
              </button>
              <button
                onClick={start}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-5"
              >
                START
              </button>
              <button
                onClick={reset}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="flex items-center justify-center">
          Created by Michael Xu
        </p>
      </footer> */}
    </div>
  );
};

export default Home;
