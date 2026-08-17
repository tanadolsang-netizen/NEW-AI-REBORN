import { useEffect, useRef } from 'react';
import { api } from '../services/api';

export function useDailyTransitNotification(prefs) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!prefs?.daily_transit) return;

    const scheduleNext = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const now = new Date();
      const [hh, mm] = (prefs.transit_time || '08:00').split(':').map(Number);
      const target = new Date(now);
      target.setHours(hh, mm, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);

      const delay = target.getTime() - now.getTime();
      timerRef.current = setTimeout(async () => {
        try {
          if ('Notification' in window && Notification.permission === 'granted') {
            const data = await api.transitNow({
              lat: 13.8591,
              lon: 100.5217,
              tz: prefs.tz_offset_hours || 7,
            });
            const sun = data.bodies?.find((b) => b.body === 'Sun');
            new Notification('Daily Transit', {
              body: sun ? `Sun in ${sun.sign}` : 'Check your transits now.',
            });
          }
        } catch {}
        scheduleNext();
      }, delay);
    };

    const ask = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      scheduleNext();
    };

    ask();
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [prefs]);

  return null;
}
