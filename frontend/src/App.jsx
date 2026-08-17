import { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';
import NatalPage from './pages/NatalPage';
import TransitPage from './pages/TransitPage';
import BranchesPage from './pages/BranchesPage';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <ErrorBoundary>
      <HashRouter>
        <div className="min-h-screen bg-[#fbfbfd] text-[#111]">
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/natal" element={<NatalPage />} />
            <Route path="/transit" element={<TransitPage />} />
            <Route path="/branches" element={<BranchesPage />} />
          </Routes>
          <Features />
          <Footer />
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
