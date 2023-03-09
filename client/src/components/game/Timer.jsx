import React, { useState, useEffect } from 'react';


export default function Timer({ message, seconds, callback }) {
  const [secondLeft, setSecondLeft] = useState(seconds);
  

  useEffect(() => {
    if (secondLeft <= 0) {
      callback();
    }

    let timerId = setTimeout(() => setSecondLeft(secondLeft - 1), 1000);

    return () => clearTimeout(timerId);
  }, [secondLeft]);

  return <span>{ `${message || ''} ${secondLeft}` }</span>
}
