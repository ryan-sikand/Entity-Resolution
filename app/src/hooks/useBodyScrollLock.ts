import { useEffect } from 'react';

let activeLocks = 0;
let previousBodyOverflow = '';

export const useBodyScrollLock = (locked = true) => {
  useEffect(() => {
    if (!locked) return;

    if (activeLocks === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    activeLocks += 1;

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);

      if (activeLocks === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, [locked]);
};
