import { useState } from 'react';
import { api } from '../services/api';

export default function NatalPage() {
  const [form, setForm] = useState({
    name: 'Mai',
    date: '2000-05-19',
    time: '14:30:00',
    tz_offset_hours: 7,
    lat: 13.8591,
    lon: 100.5217,
    system: 'tropical',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const compute = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await api.natal(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const update = (field) => (ev) => setForm((f) => ({ ...f, [field]: ev.target.value }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Natal Chart</h1>
      <form onSubmit={compute} className="space-y-2 max-w-md">
        <input className="border p-2 w-full" placeholder="Name" value={form.name} onChange={update('name')} />
        <input className="border p-2 w-full" type="date" value={form.date} onChange={update('date')} />
        <input className="border p-2 w-full" type="time" step="1" value={form.time} onChange={update('time')} />
        <input className="border p-2 w-full" type="number" step="0.01" value={form.lat} onChange={update('lat')} />
        <input className="border p-2 w-full" type="number" step="0.01" value={form.lon} onChange={update('lon')} />
        <select className="border p-2 w-full" value={form.system} onChange={update('system')}>
          <option value="tropical">Tropical</option>
          <option value="vedic">Vedic</option>
        </select>
        <button className="bg-black text-white px-4 py-2" type="submit">Compute</button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="border rounded p-3">
          <h2 className="font-semibold">{result.name} — {result.datetime_utc}</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(result.bodies, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
