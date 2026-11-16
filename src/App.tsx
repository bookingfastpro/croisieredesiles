import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import { getCircuits, checkSession, logout } from './services/api';
import usePageMeta from './hooks/usePageMeta';
import { SettingsProvider } from './context/SettingsContext';
import { Circuit } from './types';
import { Settings, LogOut } from 'lucide-react';

// Code-splitting: secondary pages and modals are loaded on demand,
// which keeps the initial JavaScript bundle small for the home page.
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BoatsPage = lazy(() => import('./pages/BoatsPage'));
const PrestationsPage = lazy(() => import('./pages/PrestationsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CircuitDetail = lazy(() => import('./components/CircuitDetail'));
const loadAdminPanel = () => import('./components/AdminPanel');
const AdminPanel = lazy(loadAdminPanel);
const Login = lazy(() => import('./components/Login'));

function PageFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />;
}

function AppContent() {
  usePageMeta();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [circuits, setCircuits] = useState<Circuit[]>(() => {
    try {
      const stored = localStorage.getItem("cache_circuits");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchCircuits = async () => {
    const data = await getCircuits();
    setCircuits(data);
  };

  useEffect(() => {
    fetchCircuits();
    // Only trust a stored token if the server still recognises it
    checkSession().then(valid => {
      setIsAuthenticated(valid);
      setAuthChecked(true);
    });
  }, []);

  // The admin area is reached through /admin (no public button for visitors)
  useEffect(() => {
    if (location.pathname === '/admin' && authChecked) {
      if (isAuthenticated) setIsAdminOpen(true);
      else {
        setIsLoginOpen(true);
        loadAdminPanel();
      }
      navigate('/', { replace: true });
    }
  }, [location.pathname, isAuthenticated, authChecked, navigate]);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-marine-turquoise selection:text-white">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:bg-marine-navy focus:text-white focus:rounded-lg focus:font-bold"
      >
        Aller au contenu principal
      </a>
      <Navbar />

      <main id="contenu" tabIndex={-1} className="outline-none">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home circuits={circuits} onSelectCircuit={setSelectedCircuit} />} />
            <Route path="/qui-sommes-nous" element={<AboutPage />} />
            <Route path="/nos-bateaux" element={<BoatsPage />} />
            <Route path="/nos-prestations" element={<PrestationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/mentions-legales" element={<LegalPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
            <Route path="/admin" element={<PageFallback />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Admin controls: only visible once logged in */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            onClick={handleLogout}
            className="p-4 bg-white rounded-full hover:bg-red-50 text-red-600 transition-all border border-red-200 shadow-xl group"
            aria-label="Déconnexion de l'administration"
            title="Déconnexion"
          >
            <LogOut size={24} aria-hidden="true" className="group-hover:rotate-12 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAdminOpen(true)}
            className="p-4 rounded-full transition-all shadow-xl group border bg-marine-blue text-white border-marine-blue"
            aria-label="Ouvrir le panel administrateur"
            title="Panel Admin"
          >
            <Settings size={24} aria-hidden="true" className="group-hover:rotate-90 transition-transform duration-500" />
          </motion.button>
        </div>
      )}

      {/* Modals — each in its own Suspense so lazy loading never blocks exit animations */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedCircuit && (
            <CircuitDetail key="circuit" circuit={selectedCircuit} onClose={() => setSelectedCircuit(null)} />
          )}
        </AnimatePresence>
      </Suspense>
      <Suspense fallback={null}>
        <AnimatePresence>
          {isLoginOpen && (
            <Login
              key="login"
              onClose={() => setIsLoginOpen(false)}
              onSuccess={() => {
                setIsLoginOpen(false);
                setIsAuthenticated(true);
                setIsAdminOpen(true);
              }}
            />
          )}
        </AnimatePresence>
      </Suspense>
      <Suspense fallback={null}>
        {isAdminOpen && (
          <AdminPanel onClose={() => setIsAdminOpen(false)} onUpdate={fetchCircuits} onLogout={handleLogout} />
        )}
      </Suspense>

      {/* Global Background Texture */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] opacity-5 bg-[radial-gradient(#0a192f_1px,transparent_1px)] [background-size:24px_24px]"></div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SettingsProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </SettingsProvider>
    </MotionConfig>
  );
}
