import { useState, useEffect } from 'react';

export const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const downHandler = (ev: KeyboardEvent) => {
      if (ev.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (ev: KeyboardEvent) => {
      if (ev.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};
