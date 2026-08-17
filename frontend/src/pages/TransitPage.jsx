import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useDailyTransitNotification } from '../hooks/useDailyTransitNotification';

export default function TransitPage() {
  const [now, setNow] = useState(null);
  const [prefs, setPrefs] = useState({ daily_transit: true, transit_time: '08:00', tz_offset_hours: 7 });

  useEffect(() => {
    api.transitNow({ lat: 13.8591, lon: 100.5217, tz: 7 }).then(setNow).catch(console.error);
  }, []);
  useDailyTransitNotification(prefs);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Current Transits</h1>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={prefs.daily_transit}
          onChange={(e) => setPrefs((p) => ({ ...p, daily_transit: e.target.checked }))}
        />
        <span>Daily transit notification</span>
      </label>
      {now ? (
        <div className="border rounded p-3">
          <p className="text-sm">{now.now_utc}</p>
          <pre className="text-sm overflow-auto">{JSON.stringify(now.bodies, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
