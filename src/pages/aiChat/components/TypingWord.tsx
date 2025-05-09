import { useEffect, useState } from 'react';

interface TypingWordProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingWord = ({ text, speed = 30, onComplete }: TypingWordProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setShowCursor(false);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {showCursor && <span className='cursor'>|</span>}
    </span>
  );
};

export default TypingWord;
