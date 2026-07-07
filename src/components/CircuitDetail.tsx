import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Info, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Ship, Sparkles, X, Coffee } from 'lucide-react';
import { Circuit, Boat } from '../types';
import { AnimatePresence } from 'motion/react';
import { getBoats } from '../services/api';

interface Props {
  circuit: Circuit;
  onClose: () => void;
}

export default function CircuitDetail({ circuit, onClose }: Props) {
  const [selectedBoat, setSelectedBoat] = useState<'prestige' | 'pardo'>(circuit.exclusiveBoat || 'prestige');
  const [boats, setBoats] = useState<Boat[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBoats = async () => {
      const data = await getBoats();
      setBoats(data);
    };
    fetchBoats();
  }, []);

  const boatImages = circuit.boatImages 
    ? (selectedBoat === 'prestige' ? circuit.boatImages.prestige : circuit.boatImages.pardo)
    : [circuit.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % boatImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + boatImages.length) % boatImages.length);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedBoat]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-marine-ink/80 backdrop-blur-md hidden md:block"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full h-full md:max-w-5xl md:max-h-[90vh] bg-white md:rounded-[2.5rem] rounded-none border border-gray-200 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header: Image Carousel */}
        <div className="relative h-64 md:h-[400px] overflow-hidden shrink-0 group">
          <AnimatePresence mode="wait">
            <motion.img 
              key={`${selectedBoat}-${currentImageIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              src={boatImages[currentImageIndex]} 
              alt={circuit.name} 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-marine-ink via-marine-navy/20 to-transparent"></div>
          
          {/* Navigation Arrows */}
          {boatImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Indicators */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5">
            {boatImages.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
              ></div>
            ))}
          </div>

          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-glow">{circuit.name}</h2>
              <div className="flex items-center gap-4 text-marine-cyan mt-2">
                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
                  <Calendar size={16} /> {circuit.duration}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="text-sm text-white/80 font-medium">À bord du Prestige 42 Flybridge</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-xl border border-white/20">
              <span className="text-xl font-bold text-white uppercase tracking-tight">
                {circuit.category === 'circuit' ? 'À partir de 1800€' : 'Sur Devis'}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 text-white transition-colors z-10 border border-white/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content: Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 bg-white">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column: Description & Locations */}
            <div className="lg:col-span-1 space-y-10">
              <section>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-marine-navy">
                  <Info size={20} /> Description
                </h3>
                <p className="text-marine-navy/80 leading-relaxed font-light">
                  {circuit.longDescription}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-marine-navy">
                  <MapPin size={20} /> Lieux clés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {circuit.locations.map((location, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 rounded-xl text-xs font-medium text-marine-navy/80 border border-gray-100">
                      {location}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2 text-marine-navy">
                  <CheckCircle2 size={20} /> Infos Pratiques
                </h3>
                <ul className="space-y-3">
                  {circuit.practicalInfos.map((info, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-marine-navy/80 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-marine-blue mt-1.5 shrink-0"></div>
                      {info}
                    </li>
                  ))}
                </ul>
              </section>

              {boats.find(b => b.name.toLowerCase().includes(selectedBoat))?.options && (
                <section className="p-5 bg-marine-blue/10 rounded-3xl border border-marine-blue/20 shadow-sm">
                  <h3 className="text-sm font-bold text-marine-blue uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Coffee size={18} /> Prestations & Options
                  </h3>
                  <ul className="space-y-2">
                    {boats.find(b => b.name.toLowerCase().includes(selectedBoat))?.options?.map((option, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-marine-navy/80 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-marine-cyan"></div>
                        {option}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right Column: Itinerary */}
            <div className="lg:col-span-2">
              <section>
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-marine-navy">
                  <MapPin size={20} /> Itinéraire détaillé
                </h3>
                <div className="relative pl-8 space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-marine-blue/20">
                  {circuit.itinerary.map((step, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[33px] top-1.5 w-[32px] h-[32px] rounded-full bg-white border-2 border-marine-blue/30 flex items-center justify-center text-marine-blue text-[11px] font-bold z-10 shadow-sm group-hover:border-marine-blue transition-colors">
                        {i + 1}
                      </div>
                      <div className="p-3 rounded-xl hover:bg-marine-blue/5 transition-all">
                        <p className="text-sm text-marine-navy/80 leading-relaxed font-light group-hover:text-marine-navy transition-colors">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <Link to="/contact" className="flex-1" onClick={onClose}>
              <button className="w-full py-4 bg-marine-blue hover:bg-marine-navy text-white rounded-2xl font-bold transition-all shadow-lg shadow-marine-blue/20 hover:scale-[1.02] active:scale-95">
                {circuit.priceOnRequest ? 'Demander un devis personnalisé' : 'Réserver ce circuit'}
              </button>
            </Link>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-marine-navy rounded-2xl font-bold transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
