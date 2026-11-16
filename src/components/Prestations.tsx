import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Euro, Calendar, Sun, Sparkles, Ship, Map, ChevronRight, Clock, MapPin, ChevronDown, X, ChevronLeft } from 'lucide-react';
import { getCircuits, getBoats } from '../services/api';
import useModal from '../hooks/useModal';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/price';
import { Circuit, Boat } from '../types';

export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  calendar: <Calendar size={24} />,
  ship: <Ship size={24} />,
  sparkles: <Sparkles size={24} />,
  sun: <Sun size={24} />,
  map: <Map size={24} />,
  clock: <Clock size={24} />,
};

export default function Prestations() {
  const { rates, ratesNote, services, faq } = useSettings().settings;
  const [circuits, setCircuits] = useState<Circuit[]>(() => {
    try {
      const stored = localStorage.getItem("cache_circuits");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [boats, setBoats] = useState<Boat[]>(() => {
    try {
      const stored = localStorage.getItem("cache_boats");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [expandedItineraries, setExpandedItineraries] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<'circuit' | 'croisiere'>('circuit');
  const [selectedBoat, setSelectedBoat] = useState<'prestige' | 'pardo'>('prestige');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  const toggleItinerary = (id: string) => {
    setExpandedItineraries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = (e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    }
  };

  const lightboxRef = useModal<HTMLDivElement>(closeLightbox, isLightboxOpen);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      const [circuitsData, boatsData] = await Promise.all([
        getCircuits(),
        getBoats()
      ]);
      if (circuitsData && circuitsData.length > 0) setCircuits(circuitsData);
      if (boatsData && boatsData.length > 0) setBoats(boatsData);
    };
    fetchData();
  }, []);

  return (
    <section id="prestations" className="py-24 px-6 bg-white text-marine-navy relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#0a192f_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-marine-cyan/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-marine-blue/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
            <Euro size={14} aria-hidden="true" /> Nos Prestations
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Tarifs & prestations en bateau privé à Bonifacio</h1>
          <p className="text-marine-navy/80 max-w-2xl mx-auto font-light text-sm sm:text-base">
            Toutes nos prestations sont basées sur la privatisation. Spécialiste de la journée et de la croisière personnalisée, nous adaptons chaque moment à vos attentes.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Services Grid - Now full width or centered */}
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:border-marine-cyan/50 transition-all group"
              >
                <div className="flex flex-col gap-4">
                  <div aria-hidden="true" className="w-12 h-12 rounded-2xl bg-marine-blue/10 flex items-center justify-center text-marine-blue group-hover:scale-110 transition-transform">
                    {SERVICE_ICONS[service.icon] || SERVICE_ICONS.sparkles}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-2 text-marine-navy">{service.title}</h2>
                    <p className="text-marine-navy/80 text-sm font-light mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {service.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-marine-blue font-bold">
                          <div aria-hidden="true" className="w-1 h-1 rounded-full bg-marine-blue"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Circuits Section */}
        <div className="mt-24 md:mt-32">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
              <Map size={14} aria-hidden="true" /> Nos Suggestions
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Expériences en Mer</h2>
            <p className="text-marine-navy/80 max-w-2xl mx-auto font-light text-sm sm:text-base mb-8">
              Découvrez nos parcours exclusifs au départ de Bonifacio. Des itinéraires pensés pour vous faire vivre le meilleur de la Corse et de la Sardaigne.
            </p>

            {/* Options section for the only boat: Prestige */}
            {boats.find(b => b.name.toLowerCase().includes('prestige'))?.options && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-marine-blue/10 rounded-3xl border border-marine-blue/20 max-w-2xl mx-auto shadow-sm"
              >
                <h3 className="text-[11px] md:text-xs font-bold text-marine-blue uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
                  <Sparkles size={14} aria-hidden="true" /> Options & Prestations à bord du Prestige 42 Flybridge
                </h3>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                  {boats.find(b => b.name.toLowerCase().includes('prestige'))?.options?.map((option, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-marine-navy/80 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-marine-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                      {option}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div role="group" aria-label="Type d'expérience" className="inline-flex p-1.5 bg-gray-100 rounded-2xl shadow-inner">
              <button
                type="button"
                aria-pressed={activeCategory === 'circuit'}
                onClick={() => setActiveCategory('circuit')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === 'circuit'
                    ? 'bg-white text-marine-blue shadow-md'
                    : 'text-marine-navy/75 hover:text-marine-navy'
                }`}
              >
                Excursions
              </button>
              <button
                type="button"
                aria-pressed={activeCategory === 'croisiere'}
                onClick={() => setActiveCategory('croisiere')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === 'croisiere'
                    ? 'bg-white text-marine-blue shadow-md'
                    : 'text-marine-navy/75 hover:text-marine-navy'
                }`}
              >
                Croisières
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:gap-12">
            {circuits
              .filter(c => c.category === activeCategory && !c.hidden)
              .filter(c => !c.exclusiveBoat || c.exclusiveBoat === selectedBoat)
              .length > 0 ? (
                circuits
                  .filter(c => c.category === activeCategory && !c.hidden)
                  .filter(c => !c.exclusiveBoat || c.exclusiveBoat === selectedBoat)
                  .map((circuit, i) => {
                    // Determine image based on selected boat
                    const displayImage = circuit.boatImages 
                      ? (selectedBoat === 'prestige' ? circuit.boatImages.prestige[0] : circuit.boatImages.pardo[0])
                      : circuit.image;

                    return (
                      <motion.div
                        key={circuit.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
                      >
                        <div className="flex flex-col">
                          {/* Image Header */}
                          <div 
                            className="h-64 sm:h-80 md:h-[450px] w-full relative overflow-hidden cursor-pointer group/img"
                            onClick={() => {
                              const images = circuit.boatImages 
                                ? (selectedBoat === 'prestige' ? circuit.boatImages.prestige : circuit.boatImages.pardo)
                                : [circuit.image];
                              openLightbox(images);
                            }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.img 
                                key={`${circuit.id}-${selectedBoat}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                src={displayImage} 
                                alt={`${circuit.name} – excursion en bateau au départ de Bonifacio`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-marine-ink via-marine-navy/20 to-transparent"></div>
                            
                            {/* Keyboard-accessible gallery trigger */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const images = circuit.boatImages
                                  ? (selectedBoat === 'prestige' ? circuit.boatImages.prestige : circuit.boatImages.pardo)
                                  : [circuit.image];
                                openLightbox(images);
                              }}
                              className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-white font-bold uppercase tracking-widest text-[11px]"
                              aria-label={`Voir les photos : ${circuit.name}`}
                            >
                              Voir les photos
                            </button>
                            
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                               <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                 <Ship size={12} aria-hidden="true" /> Prestige 42 Flybridge
                               </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                                <div>
                                  <div className="flex items-center gap-2 text-marine-cyan mb-2 md:mb-3 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[11px] md:text-xs font-bold">
                                    <Clock size={14} className="md:w-4 md:h-4" /> {circuit.duration}
                                  </div>
                                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white text-glow leading-tight">{circuit.name}</h3>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 self-start md:self-auto">
                                  <span className="text-marine-mist text-[11px] md:text-xs font-bold uppercase tracking-widest block mb-0.5 md:mb-1">
                                    Tarification
                                  </span>
                                  <span className="text-xl md:text-2xl font-bold text-white">
                                    {formatPrice(circuit)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-8 md:p-12 bg-white">
                        <p className="text-marine-navy/70 font-light mb-8 md:mb-12 leading-relaxed text-base md:text-lg max-w-4xl">
                          {circuit.longDescription}
                        </p>

                        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                          <div className="lg:col-span-1 space-y-6 md:space-y-8">
                            <div className="space-y-4 md:space-y-6">
                              <h4 className="text-[11px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
                                <MapPin size={14} className="md:w-4 md:h-4" /> Lieux clés
                              </h4>
                              <div className="flex flex-wrap gap-2 md:gap-3">
                                {circuit.locations.map((location, j) => (
                                  <span key={j} className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium text-marine-navy/80 border border-gray-100 hover:bg-marine-blue/10 transition-colors">
                                    {location}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                              <h4 className="text-[11px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
                                <Ship size={14} className="md:w-4 md:h-4" /> Infos Pratiques
                              </h4>
                              <div className="grid gap-2 md:gap-3">
                                {circuit.practicalInfos.map((info, j) => (
                                  <div key={j} className="flex items-start gap-3 text-xs md:text-sm text-marine-navy/80 italic">
                                    <div className="w-1.5 h-1.5 rounded-full bg-marine-blue mt-1.5 shrink-0"></div>
                                    {info}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Seasonal Rates Integration */}
                            {(circuit.showSeasonalRates ?? (circuit.name.includes("Lavezzi") || circuit.name.includes("Roccapina"))) && rates.length > 0 && (
                              <div className="space-y-4 md:space-y-6 pt-6 border-t border-gray-100">
                                <h4 className="text-[11px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
                                  <Calendar size={14} className="md:w-4 md:h-4" /> Tarifs Location Journée
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {rates.map((rate, k) => (
                                    <div key={k} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                      <span className="text-[11px] text-marine-navy/60 uppercase tracking-wider font-bold mb-1">{rate.label}</span>
                                      <span className="text-sm font-bold text-marine-blue">{rate.price}</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[11px] text-marine-navy/70 italic">
                                  {ratesNote}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            <button
                              type="button"
                              aria-expanded={!!expandedItineraries[circuit.id]}
                              aria-controls={`itineraire-${circuit.id}`}
                              onClick={() => toggleItinerary(circuit.id)}
                              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 group/btn ${
                                expandedItineraries[circuit.id] 
                                  ? 'bg-marine-blue text-white border-marine-blue shadow-xl shadow-marine-blue/20' 
                                  : 'bg-white border-gray-100 hover:border-marine-blue hover:bg-marine-blue/5 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${expandedItineraries[circuit.id] ? 'bg-white text-marine-blue rotate-90' : 'bg-marine-blue/10 text-marine-blue'}`}>
                                  <Map size={20} className={expandedItineraries[circuit.id] ? 'scale-110' : ''} />
                                </div>
                                <div className="text-left">
                                  <span className={`block text-sm md:text-base uppercase tracking-[0.1em] font-bold transition-colors ${expandedItineraries[circuit.id] ? 'text-white' : 'text-marine-navy'}`}>
                                    Itinéraire détaillé
                                  </span>
                                  <span className={`block text-[11px] uppercase tracking-widest font-medium opacity-80 ${expandedItineraries[circuit.id] ? 'text-white' : 'text-marine-blue'}`}>
                                    {circuit.itinerary.length} étapes à découvrir
                                  </span>
                                </div>
                              </div>
                              <div className={`flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-widest font-bold transition-all duration-500 ${expandedItineraries[circuit.id] ? 'text-white translate-x-1' : 'text-marine-navy/60 group-hover/btn:text-marine-blue'}`}>
                                {expandedItineraries[circuit.id] ? 'Fermer' : 'Explorer'}
                                <ChevronRight size={16} className={`transition-transform duration-500 ${expandedItineraries[circuit.id] ? 'rotate-90' : ''}`} />
                              </div>
                            </button>

                            <AnimatePresence>
                              {expandedItineraries[circuit.id] && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                  className="overflow-hidden"
                                  id={`itineraire-${circuit.id}`}
                                >
                                  <ol className="relative pl-8 md:pl-12 py-6 space-y-8">
                                    {/* Vertical Timeline Line */}
                                    <div aria-hidden="true" className="absolute left-[15px] md:left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-marine-blue/40 via-marine-blue/20 to-transparent"></div>

                                    {circuit.itinerary.map((step, j) => (
                                      <motion.li
                                        key={j}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: j * 0.1 }}
                                        className="relative group"
                                      >
                                        {/* Timeline Node */}
                                        <div className="absolute -left-[25px] md:-left-[33px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white border-2 border-marine-blue z-10 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-marine-blue/20">
                                          <div className="absolute inset-1 rounded-full bg-marine-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>

                                        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-marine-navy/5 group-hover:border-marine-blue/20 transition-all duration-300">
                                          <p className="text-sm text-marine-navy/80 leading-relaxed font-light">
                                            <span className="font-bold text-marine-blue/60 mr-2">#{j + 1}</span>
                                            {step}
                                          </p>
                                        </div>
                                      </motion.li>
                                    ))}
                                  </ol>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Ship size={32} />
                </div>
                <h3 className="text-xl font-display font-bold text-marine-navy mb-2">
                  Aucun itinéraire disponible pour cette catégorie.
                </h3>
                <p className="text-marine-navy/60 font-light max-w-md mx-auto">
                  Découvrez l'ensemble de nos excursions à la journée ou nos croisières d'exception.
                </p>
                <button 
                  onClick={() => {
                    setSelectedBoat('prestige');
                    setActiveCategory(activeCategory === 'circuit' ? 'croisiere' : 'circuit');
                  }}
                  className="mt-8 px-8 py-3 bg-marine-blue text-white rounded-xl font-bold hover:bg-marine-navy transition-all shadow-lg shadow-marine-blue/20"
                >
                  Voir les autres expériences
                </button>
              </motion.div>
            )}
          </div>
      </div>

        {/* FAQ – answers the most common questions (useful for visitors and search engines) */}
        <div className="mt-24 md:mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-marine-navy text-center">Questions fréquentes</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group bg-gray-50 rounded-2xl border border-gray-100 open:bg-white open:shadow-lg">
                <summary className="cursor-pointer list-none flex justify-between items-center gap-4 p-5 font-bold text-marine-navy">
                  {item.q}
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-marine-blue transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-marine-navy/80 font-light leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
    </div>

    {/* Lightbox Gallery */}
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
          tabIndex={-1}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none outline-none"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            aria-label="Fermer la vue agrandie"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/80 hover:text-white transition-colors p-2.5 bg-white/10 rounded-full backdrop-blur-md z-20"
          >
            <X size={26} aria-hidden="true" />
          </button>

          {/* Controls - Only show if multiple images */}
          {lightboxImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                aria-label="Photo précédente"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-black/40 sm:bg-white/10 hover:bg-white/20 p-2.5 sm:p-4 rounded-full backdrop-blur-md z-20 active:scale-95 transition-all"
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
              <button 
                onClick={nextImage}
                aria-label="Photo suivante"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-black/40 sm:bg-white/10 hover:bg-white/20 p-2.5 sm:p-4 rounded-full backdrop-blur-md z-20 active:scale-95 transition-all"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-5xl w-full max-h-[85vh] relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={lightboxImages[currentImageIndex]}
              alt={`Photo ${currentImageIndex + 1} sur ${lightboxImages.length}`}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            
            {/* Counter */}
            {lightboxImages.length > 1 && (
              <div aria-live="polite" className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-xs uppercase">
                {currentImageIndex + 1} / {lightboxImages.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
</section>
);
}
