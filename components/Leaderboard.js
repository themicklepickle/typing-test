import { Line } from 'rc-progress';
import PlayerProgress from './PlayerProgress';

const Leaderboard = ({ players }) => {
  if (players.length === 0)
    return (
      <div className="flex h-full">
        <h1 className="text-center m-auto text-2xl text-gray-500 italic">
          You&apos;re the first one here!
        </h1>
      </div>
    );

  return (
    <div className="grid h-full">
      {Object.values(players).map(({ id, ...playerProps }) => (
        <PlayerProgress key={id} {...playerProps} />
      ))}
    </div>
  );
};

export default Leaderboard;

/*
TODO:
// - reset button
// - wpm
- finish
- end screen


*/
