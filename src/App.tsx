import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import CircuitDetail from './components/CircuitDetail';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import BoatsPage from './pages/BoatsPage';
import PrestationsPage from './pages/PrestationsPage';
import ContactPage from './pages/ContactPage';
import { getCircuits } from './services/api';
import { Circuit } from './types';
import { Settings, LogOut } from 'lucide-react';

export default function App() {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchCircuits = async () => {
    const data = await getCircuits();
    setCircuits(data);
  };

  useEffect(() => {
    fetchCircuits();
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

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
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <Footer />

        {/* Admin Toggle Button */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
          <AnimatePresence>
            {isAuthenticated && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={handleLogout}
                className="p-4 glass-blue rounded-full hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 shadow-xl group"
                title="Déconnexion"
              >
                <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdminClick}
            className={`p-4 rounded-full transition-all shadow-xl group border ${
              isAuthenticated 
                ? 'bg-marine-turquoise text-white border-marine-turquoise' 
                : 'glass-blue text-white border-white/10 hover:border-white/20'
            }`}
            title={isAuthenticated ? "Panel Admin" : "Connexion Admin"}
          >
            <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </motion.button>
        </div>

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
          {isLoginOpen && (
            <Login 
              onClose={() => setIsLoginOpen(false)}
              onSuccess={() => {
                setIsLoginOpen(false);
                setIsAuthenticated(true);
                setIsAdminOpen(true);
              }}
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
