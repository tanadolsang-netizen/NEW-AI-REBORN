import { createContext, useContext, useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';
import NatalPage from './pages/NatalPage';
import TransitPage from './pages/TransitPage';
import BranchesPage from './pages/BranchesPage';
import DashboardPage from './pages/DashboardPage';
import SynastryPage from './pages/SynastryPage';
import ChartCanvas from './components/ChartCanvas';
import AuthModal from './components/AuthModal';
import UpgradeModal from './components/UpgradeModal';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ setAuthOpen, setUpgradeOpen }}>
      <ErrorBoundary>
        <HashRouter>
          <div className="min-h-screen bg-[#fbfbfd] text-[#111]">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/natal" element={<NatalPage />} />
              <Route path="/synastry" element={<SynastryPage />} />
              <Route path="/transit" element={<TransitPage />} />
              <Route path="/branches" element={<BranchesPage />} />
            </Routes>
            <Features />
            <Footer />
            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
            {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
          </div>
        </HashRouter>
      </ErrorBoundary>
    </ModalContext.Provider>
  );
}
