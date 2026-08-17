import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TransitPage() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    api.transitNow({ lat: 13.8591, lon: 100.5217, tz: 7 }).then(setNow).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Current Transits</h1>
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
