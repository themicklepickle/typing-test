import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import Leaderboard from '../components/Leaderboard';
import Prompt from '../components/Prompt';
import ReactCanvasConfetti from 'react-canvas-confetti';
import useConfetti from '../hooks/useConfetti';
import PlayerProgress from '../components/PlayerProgress';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Head from 'next/head';

const stringToWordsArray = (string) => {
  const wordsArray = string.split(' ');

  return wordsArray.map((word, index) =>
    index < wordsArray.length - 1 ? word + ' ' : word
  );
};

const Home = () => {
  const [gameState, setGameState] = useState({});
  const [name, setName] = useState('');
  const [screen, setScreen] = useState('registration');
  const [wordNumber, setWordNumber] = useState(0);
  const [input, setInput] = useState('');
  const [wordsArray, setWordsArray] = useState([]);
  const [progress, setProgress] = useState({});
  const [charactersTyped, setCharactersTyped] = useState(0);
  const [startTime, setStartTime] = useState();
  const [key, setKey] = useState(0);
  const [socket, setSocket] = useState();

  const { fire, getInstance, canvasStyles } = useConfetti();

  const nameInputElement = useRef(null);
  const inputElement = useRef(null);
  useEffect(() => {
    if (nameInputElement.current) {
      nameInputElement.current.focus();
    }
  }, []);

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log(socket.id);
      console.log('connected');
    });

    socket.on('update-game-state', (newGameState) => {
      setGameState(newGameState);
    });

    socket.on('update-text', (newText) => {
      reset();
      setWordsArray(stringToWordsArray(newText));
    });

    socket.on('start', () => {
      reset();
      setScreen('countdown');
      setStartTime(new Date().getTime());
    });

    socket.on('reset', () => {
      reset();
    });

    socket.on('disconnect', () => {
      setScreen('registration');
      reset();
    });
  });

  useEffect(() => {
    if (socket) socket.emit('progress-change', { newProgress: progress });
    if (progress.percentage === 1) {
      setScreen('finished');

      fire();
    }
  }, [progress, fire]);

  useEffect(() => {
    const realWordsTyped = charactersTyped / 5;
    const minutesElapsed = (new Date().getTime() - startTime) / 60000;

    setProgress({
      percentage: wordNumber / wordsArray.length,
      wpm: Math.floor(realWordsTyped / minutesElapsed) * 2,
    });
  }, [wordNumber]);

  useEffect(() => {
    if (input === wordsArray[wordNumber]) {
      setWordNumber(wordNumber + 1);
      setCharactersTyped(charactersTyped + input.length);
      setInput('');
    }
  }, [input]);

  useLayoutEffect(() => {
    if (screen === 'game') inputElement.current.focus();
  }, [screen]);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    setSocket(io());
  };

  const reset = () => {
    setScreen('waiting');
    setWordNumber(0);
    setInput('');
    setProgress({});
    setStartTime();
    setCharactersTyped(0);
  };

  const register = () => {
    socket.emit('new-player', { name });
    setScreen('waiting');
  };

  const isRegistration = () => {
    return screen !== 'registration';
  };

  const otherPlayers = Object.values(gameState)
    .filter(({ id }) => id != socket?.id)
    .sort((a, b) => {
      if (!a.progress.percentage) return 10000000;
      return b.progress.percentage - a.progress.percentage;
    });

  return (
    <div>
      <Head>
        <title>Michael Type</title>
        <meta property="og:title" content="Michael Type" key="title" />
      </Head>

      <main className="select-none">
        {screen === 'registration' && (
          <div className="grid place-items-center h-screen">
            <div>
              <h1 className="sm:text-5xl text-3xl font-bold mb-5">
                Choose a name!
              </h1>

              <input
                ref={nameInputElement}
                placeholder="Name"
                value={name}
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-sky-400 focus:ring-sky-500 focus:ring-1 sm:text-xl shadow-sm"
                type="text"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') register();
                }}
              />
            </div>
          </div>
        )}

        {(screen === 'waiting' ||
          screen === 'game' ||
          screen === 'finished') && (
          <div className="grid h-screen place-content-center">
            <div className="flex flex-col h-screen w-screen max-w-3xl p-8">
              <div className="flex-auto h-max">
                <Leaderboard players={otherPlayers} />
              </div>

              <div className="h-2/5 mt-6">
                <PlayerProgress name={name + ' (you)'} progress={progress} />
                <Prompt wordsArray={wordsArray} wordNumber={wordNumber} />
                <input
                  ref={inputElement}
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none sm:text-xl disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                  placeholder={screen === 'waiting' ? 'Please wait...' : ''}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!(screen === 'game')}
                  autoCapitalize={false}
                  autoCorrect={false}
                />
              </div>
            </div>
          </div>
        )}
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <div
          className={`fixed ${
            screen === 'countdown' ? '' : 'hidden'
          } inset-0 bg-opacity-50 overflow-y-auto h-full w-full grid place-items-center`}
        >
          <div>
            <CountdownCircleTimer
              key={key}
              isPlaying={screen === 'countdown'}
              duration={3}
              colors={['#f87171', '#fb923c', '#fbbf24', '#a3e635']}
              colorsTime={[3, 2, 1, 0]}
              onComplete={() => {
                setScreen('game');
                setKey((prevKey) => prevKey + 1);
              }}
            >
              {({ remainingTime }) => (
                <h1 className="text-5xl">{remainingTime}</h1>
              )}
            </CountdownCircleTimer>
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
