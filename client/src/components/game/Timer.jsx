import React, { useState } from 'react';

export default function Timer({ seconds, callback }) {
  const [secondLeft, setSecondLeft] = useState(seconds);
  if (secondLeft === 0) callback();

  useEffect(() => {
    setInterval(() => setSecondLeft(secondLeft - 1), 1000);
  }, []);

  return <span>{ secondLeft }</span>
}
