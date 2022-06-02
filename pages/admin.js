import { useEffect, useState } from 'react';
import io from 'Socket.IO-client';
import Leaderboard from '../components/Leaderboard';

let socket;

const Home = () => {
  const [gameState, setGameState] = useState({});
  const [text, setText] = useState('');

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

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
  };

  const start = () => {
    socket.emit('start');
  };

  const generateNewText = () => {
    socket.emit('generate-new-text');
  };

  const reset = () => {
    socket.emit('reset');
  };

  const players = Object.values(gameState).sort(
    (a, b) => b.progress - a.progress
  );

  return (
    <div>
      {/* <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className="select-none">
        <div className="grid h-screen place-content-center">
          <div className="flex flex-col h-screen w-screen max-w-3xl p-8">
            <div className="flex-auto h-max">
              <Leaderboard players={players} />
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

        {/* {screen === 'registration' && (
          <div className="grid place-items-center h-screen">
            <div>
              <h1 className="sm:text-5xl text-3xl font-bold mb-5">
                Choose a name!
              </h1>

              <input
                ref={nameInputElement}
                placeholder="Name"
                value={name}
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-xl shadow-sm"
                type="text"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') register();
                }}
              />
            </div>
          </div>
        )}

        {screen === 'game' && (
          <div className="grid h-screen place-content-center">
            <div className="flex flex-col h-screen w-screen max-w-2xl p-8">
              <div className="flex-auto h-max">
                <Leaderboard otherPlayers={otherPlayers} />
              </div>
              <div className="h-2/5">
                <Prompt text={text} wordNumber={wordNumber} />
                <input
                  onLoad={() => {
                    inputElement.current.focus();
                  }}
                  ref={inputElement}
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none sm:text-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        )} */}
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
