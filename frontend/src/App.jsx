import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const NatalPage = lazy(() => import('./pages/NatalPage'));
const TransitPage = lazy(() => import('./pages/TransitPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));

function Loader() {
  return (
    <div className="flex items-center justify-center h-24 text-[13px] text-black/40">
      กำลังโหลด...
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-black antialiased">
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <NatalPage />
              <TransitPage />
              <BranchesPage />
            </>
          } />
          <Route path="/natal" element={<NatalPage />} />
          <Route path="/transit" element={<TransitPage />} />
          <Route path="/branches" element={<BranchesPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
