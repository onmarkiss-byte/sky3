
import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const useMining = () => {
  const { miningRate, setBalance } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate earnings per second and add to balance
      const earningsPerSecond = miningRate / 60;
      setBalance(prevBalance => prevBalance + earningsPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [miningRate, setBalance]);
};
