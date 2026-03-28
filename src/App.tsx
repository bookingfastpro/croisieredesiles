import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import CircuitDetail from './components/CircuitDetail';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import BoatsPage from './pages/BoatsPage';
import PrestationsPage from './pages/PrestationsPage';
import { getCircuits } from './services/api';
import { Circuit } from './types';
import { Settings } from 'lucide-react';

export default function App() {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchCircuits = async () => {
    const data = await getCircuits();
    setCircuits(data);
  };

  useEffect(() => {
    fetchCircuits();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans selection:bg-marine-turquoise selection:text-white">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home circuits={circuits} onSelectCircuit={setSelectedCircuit} />} />
          <Route path="/qui-sommes-nous" element={<AboutPage />} />
          <Route path="/nos-bateaux" element={<BoatsPage />} />
          <Route path="/nos-prestations" element={<PrestationsPage />} />
        </Routes>

        <Footer />

        {/* Admin Toggle Button */}
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 glass-blue rounded-full text-white hover:scale-110 transition-transform shadow-xl"
          title="Administration"
        >
          <Settings size={24} />
        </button>

        {/* Modals */}
        <AnimatePresence>
          {selectedCircuit && (
            <CircuitDetail 
              circuit={selectedCircuit} 
              onClose={() => setSelectedCircuit(null)} 
            />
          )}
          {isAdminOpen && (
            <AdminPanel 
              onClose={() => setIsAdminOpen(false)} 
              onUpdate={fetchCircuits}
            />
          )}
        </AnimatePresence>

        {/* Global Background Texture */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5 mix-blend-multiply">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
      </div>
    </Router>
  );
}
