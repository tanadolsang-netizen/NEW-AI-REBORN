import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';

export function useDailyTransitNotification() {
  const [subscribed, setSubscribed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const scheduleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const now = new Date();
    const target = new Date(now);
    target.setHours(8, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target.getTime() - now.getTime();
    timerRef.current = setTimeout(async () => {
      try {
        const supported = typeof window !== 'undefined' && 'Notification' in window;
        if (supported && Notification.permission === 'granted') {
          const data = await api.transitNow({ lat: 13.8591, lon: 100.5217, tz: 7 });
          const sun = data?.bodies?.find((b) => b.body === 'Sun');
          new Notification('Daily Transit', { body: sun ? `Sun in ${sun.sign}` : 'Check your transits now.' });
        }
      } catch {}
      scheduleNext();
    }, delay);
  };

  const subscribe = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') await Notification.requestPermission();
    setSubscribed(true);
    scheduleNext();
  };

  const unsubscribe = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setSubscribed(false);
  };

  const supported = typeof window !== 'undefined' && 'Notification' in window;

  return { supported, subscribed, subscribe, unsubscribe };
}
