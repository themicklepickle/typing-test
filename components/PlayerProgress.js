import { Line } from 'rc-progress';
import WPM from './WPM';

const PlayerProgress = ({ name, progress, color }) => {
  return (
    <div>
      <div className="flex mb-3">
        <div className="flex flex-col grow place-content-center">
          <p className="text-lg font-mono">{name}</p>
          <Line
            percent={progress?.percentage ? progress.percentage * 100 : 0}
            strokeWidth={2}
            strokeColor={color}
          />
        </div>
        <div className="w-16 text-center flex flex-col place-content-end">
          <WPM wpm={progress.wpm} textSize="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default PlayerProgress;
