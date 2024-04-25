import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [loadingText, setLoadingText] = useState('Creating your solution');
  const loadingMessages = [
    'Creating your solution',
    'Using AI',
    'Using some magic to solve your question',
    'Crunching the numbers',
    'Calculating the answer',
    'Solving the puzzle',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        const currentIndex = loadingMessages.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [loadingMessages]);

  return (
    <div className="flex flex-col justify-center items-center h-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-600"></div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-yellow-400 absolute inset-0 m-auto"></div>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-yellow-200 absolute inset-0 m-auto"></div>
      </div>
      <div className="text-sm mt-2 font-bold ml-2 animate-pulse">{loadingText}</div>
    </div>
  );
};

export default Loader;