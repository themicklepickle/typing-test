const Prompt = ({ wordsArray, wordNumber }) => {
  const firstHalf = wordsArray.slice(0, wordNumber).join(' ') + ' ';
  const word = wordsArray[wordNumber];
  const secondHalf = ' ' + wordsArray.slice(wordNumber + 1).join(' ');

  return (
    <div className="text-2xl mb-4">
      <span>{firstHalf}</span>
      <span className="text-sky-500">{word}</span>
      <span>{secondHalf}</span>
    </div>
  );
};

export default Prompt;
