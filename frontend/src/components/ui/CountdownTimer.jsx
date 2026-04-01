import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const targetDate = new Date(expiresAt);

    const updateTimer = () => {
      const now = new Date();
      const secondsTotal = differenceInSeconds(targetDate, now);

      if (secondsTotal <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        if (onExpire) onExpire();
        return;
      }

      const d = Math.floor(secondsTotal / (3600 * 24));
      const h = Math.floor((secondsTotal % (3600 * 24)) / 3600);
      const m = Math.floor((secondsTotal % 3600) / 60);
      const s = secondsTotal % 60;

      const segments = [];
      if (d > 0) segments.push(`${d}d`);
      if (h > 0) segments.push(`${h}h`);
      if (m > 0 || h > 0) segments.push(`${m}m`);
      segments.push(`${s}s`);

      setTimeLeft(segments.join(' '));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${
      isExpired 
        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{isExpired ? 'Expired' : `Ends in ${timeLeft}`}</span>
    </div>
  );
}
