const WPM = ({ wpm, textSize, ...restProps }) => {
  if (!wpm) return;

  let bg;
  if (wpm < 20) bg = 'bg-rose-800';
  else if (wpm < 40) bg = 'bg-rose-400';
  else if (wpm < 60) bg = 'bg-orange-400';
  else if (wpm < 80) bg = 'bg-green-400';
  else if (wpm < 100) bg = 'bg-gradient-to-br from-blue-400 to-emerald-400';
  else bg = 'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500';

  return (
    <h1
      className={`font-extrabold text-transparent bg-clip-text ${bg} ${textSize}`}
    >
      {wpm}
    </h1>
  );
};

export default WPM;
