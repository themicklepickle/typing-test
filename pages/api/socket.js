import { Server } from 'Socket.IO';
import texts from '../../lib/texts';
// import * as fs from 'fs';

// fs.writeFileSync(
//   'hello',
//   JSON.stringify(
//     texts.reduce(
//       (filtered, cur) => (cur.length <= 500 ? [...filtered, cur] : filtered),
//       []
//     )
//   )
// );

// console.log(
//   texts.reduce(
//     (longest, cur) => (cur.length > longest.length ? cur : longest),
//     ''
//   )
// );

const colors = [
  '#f43f5e',
  '#fb923c',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#60a5fa',
  '#818cf8',
  '#e879f9',
  '#f9a8d41',
].reduce(
  (accumulator, value) => ({
    ...accumulator,
    [value]: false,
  }),
  {}
);

const getNextColor = () => {
  for (const c in colors) {
    if (!colors[c]) {
      colors[c] = true;
      return c;
    }
  }

  return Object.keys(colors)[0];
};

const generateNewText = () => {
  return texts[Math.floor(Math.random() * texts.length)];
};

let gameState = {};
// let admin = '';
let text = generateNewText();

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('progress-change', ({ newProgress }) => {
        if (!gameState[socket.id]) return;

        gameState[socket.id].progress = newProgress;
        socket.broadcast.emit('update-game-state', gameState);
      });

      socket.on('new-player', ({ name }) => {
        gameState[socket.id] = {
          name,
          id: socket.id,
          progress: {},
          color: getNextColor(),
        };

        socket.broadcast.emit('update-game-state', gameState);
        socket.emit('update-text', text);
      });

      socket.on('register-admin', () => {
        // if (admin !== '') return;

        // admin = socket.id;
        socket.emit('update-game-state', gameState);
        socket.emit('update-text', text);
      });

      socket.on('generate-new-text', () => {
        text = generateNewText();
        socket.broadcast.emit('update-text', text);
      });

      socket.on('reset', () => {
        socket.broadcast.emit('reset');
      });

      socket.on('start', () => {
        socket.broadcast.emit('start');
      });

      socket.on('disconnect', () => {
        // if (socket.id == admin) {
        //   admin = '';
        //   return;
        // }

        if (!gameState[socket.id]) return;

        colors[gameState[socket.id].color] = false;

        delete gameState[socket.id];
        socket.broadcast.emit('update-game-state', gameState);
      });
    });
  }
  res.end();
};

export default SocketHandler;
