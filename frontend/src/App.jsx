import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NatalPage from './pages/NatalPage';
import TransitPage from './pages/TransitPage';
import BranchesPage from './pages/BranchesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="border-b p-3 flex gap-4">
          <Link to="/natal">Natal</Link>
          <Link to="/transit">Transit</Link>
          <Link to="/branches">Branches</Link>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/natal" element={<NatalPage />} />
            <Route path="/transit" element={<TransitPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="*" element={<NatalPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
