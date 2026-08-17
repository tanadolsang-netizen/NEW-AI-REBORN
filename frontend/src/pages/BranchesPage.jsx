import { useState } from 'react';
import { api } from '../services/api';

export default function BranchesPage() {
  const [items, setItems] = useState([]);
  const [slug, setSlug] = useState(null);
  const [text, setText] = useState('');

  const loadList = async () => {
    const data = await api.branches.list();
    setItems(data.branches);
  };

  useEffect(() => { loadList(); }, []);

  const open = async (s) => {
    setSlug(s);
    const data = await api.branches.get(s);
    setText(data.content);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Astrology Branches</h1>
      <div className="flex gap-4">
        <div className="w-64 border-r pr-3">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.slug}>
                <button className="underline" onClick={() => open(it.slug)}>{it.slug}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {slug ? (
            <article className="prose">
              <h2>{slug}</h2>
              <pre className="text-sm whitespace-pre-wrap border rounded p-2">{text}</pre>
            </article>
          ) : (
            <p>Select a branch.</p>
          )}
        </div>
      </div>
    </div>
  );
}
