import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Euro, Calendar, Sun, Sparkles, Ship, Map, ChevronRight, Clock, MapPin, ChevronDown } from 'lucide-react';
import { getCircuits } from '../services/api';
import { Circuit } from '../types';

const rates = [
  { month: "Avril / Juin", price: "1800€" },
  { month: "Juillet", price: "2200€" },
  { month: "Août", price: "2500€" },
  { month: "Septembre", price: "2000€" },
];

const services = [
  {
    title: "Location à la journée",
    icon: <Calendar size={24} />,
    description: "Privatisation complète du bateau pour une journée d'exception. Le tarif inclut le carburant et les services d'un skipper professionnel.",
    details: ["Départ 10h - Retour 18h", "Carburant inclus", "Skipper inclus", "Itinéraire sur mesure"]
  },
  {
    title: "Croisières (Dès 1 nuit)",
    icon: <Ship size={24} />,
    description: "Vivez l'expérience unique d'une nuit en mer ou d'un séjour prolongé. Nos croisières sont entièrement personnalisables selon vos envies.",
    details: ["À partir d'une nuit", "Skipper inclus", "Itinéraire flexible", "Confort haut de gamme"]
  },
  {
    title: "Séjours sur Mesure",
    icon: <Sparkles size={24} />,
    description: "Vous avez un projet spécifique ? Nous créons pour vous un itinéraire et un service totalement adaptés à vos besoins.",
    details: ["Durée à la carte", "Destinations au choix", "Service VIP", "100% Personnalisable"]
  },
  {
    title: "Coucher de Soleil",
    icon: <Sun size={24} />,
    description: "Découvrez les falaises de Bonifacio sous les couleurs de l'or. Une navigation exclusive pour une fin de journée magique.",
    details: ["Départ 18h30", "Apéritif à bord", "Skipper inclus", "Ambiance intimiste"]
  }
];

export default function Prestations() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [expandedItineraries, setExpandedItineraries] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<'circuit' | 'croisiere'>('circuit');

  const toggleItinerary = (id: string) => {
    setExpandedItineraries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchCircuits = async () => {
      const data = await getCircuits();
      setCircuits(data);
    };
    fetchCircuits();
  }, []);

  return (
    <section id="prestations" className="py-24 px-6 bg-white text-marine-navy relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-marine-cyan/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-marine-blue/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
            <Euro size={14} /> Nos Prestations
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Tarifs & Services</h2>
          <p className="text-marine-navy/80 max-w-2xl mx-auto font-light text-sm sm:text-base">
            Toutes nos prestations sont basées sur la privatisation. Spécialiste de la journée et de la croisière personnalisée, nous adaptons chaque moment à vos attentes.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Services Grid - Now full width or centered */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:border-marine-cyan/50 transition-all group"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-marine-blue/10 flex items-center justify-center text-marine-blue group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-marine-navy">{service.title}</h4>
                    <p className="text-marine-navy/80 text-xs font-light mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {service.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-marine-blue font-bold">
                          <div className="w-1 h-1 rounded-full bg-marine-blue"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Circuits Section */}
        <div className="mt-24 md:mt-32">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
              <Map size={14} /> Nos Suggestions
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Expériences en Mer</h2>
            <p className="text-marine-navy/80 max-w-2xl mx-auto font-light text-sm sm:text-base">
              Découvrez nos parcours exclusifs au départ de Bonifacio. Des itinéraires pensés pour vous faire vivre le meilleur de la Corse et de la Sardaigne.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveCategory('circuit')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === 'circuit'
                    ? 'bg-white text-marine-blue shadow-md'
                    : 'text-marine-navy/50 hover:text-marine-navy'
                }`}
              >
                Excursions
              </button>
              <button
                onClick={() => setActiveCategory('croisiere')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === 'croisiere'
                    ? 'bg-white text-marine-blue shadow-md'
                    : 'text-marine-navy/50 hover:text-marine-navy'
                }`}
              >
                Croisières
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:gap-12">
            {circuits
              .filter(c => c.category === activeCategory)
              .map((circuit, i) => (
              <motion.div
                key={circuit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
              >
                <div className="flex flex-col">
                  {/* Image Header */}
                  <div className="h-64 sm:h-80 md:h-[450px] w-full relative overflow-hidden">
                    <img 
                      src={circuit.image} 
                      alt={circuit.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-marine-ink via-marine-navy/20 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                        <div>
                          <div className="flex items-center gap-2 text-marine-cyan mb-2 md:mb-3 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold">
                            <Clock size={14} className="md:w-4 md:h-4" /> {circuit.duration}
                          </div>
                          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white text-glow leading-tight">{circuit.name}</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 self-start md:self-auto">
                          <span className="text-marine-cyan text-[10px] md:text-xs font-bold uppercase tracking-widest block mb-0.5 md:mb-1">
                            Tarification
                          </span>
                          <span className="text-xl md:text-2xl font-bold text-white">
                            {circuit.category === 'circuit' ? 'À partir de 1800€' : 'Sur Devis'}
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
                          <h4 className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
                            <MapPin size={14} className="md:w-4 md:h-4" /> Lieux clés
                          </h4>
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            {circuit.locations.map((location, j) => (
                              <span key={j} className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 rounded-lg md:rounded-xl text-[10px] md:text-xs font-medium text-marine-navy/80 border border-gray-100 hover:bg-marine-blue/10 transition-colors">
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          <h4 className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
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
                        {(circuit.name.includes("Bonifacio & Îles Lavezzi") || circuit.name.includes("Criques & Roccapina")) && (
                          <div className="space-y-4 md:space-y-6 pt-6 border-t border-gray-100">
                            <h4 className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-marine-blue font-bold flex items-center gap-2">
                              <Calendar size={14} className="md:w-4 md:h-4" /> Tarifs Location Journée
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {rates.map((rate, k) => (
                                <div key={k} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                                  <span className="text-[9px] text-marine-navy/60 uppercase tracking-wider font-bold mb-1">{rate.month}</span>
                                  <span className="text-sm font-bold text-marine-blue">{rate.price}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] text-marine-navy/60 italic">
                              * Carburant et skipper inclus.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <button 
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
                              <h4 className={`text-sm md:text-base uppercase tracking-[0.1em] font-bold transition-colors ${expandedItineraries[circuit.id] ? 'text-white' : 'text-marine-navy'}`}>
                                Itinéraire détaillé
                              </h4>
                              <p className={`text-[10px] uppercase tracking-widest font-medium opacity-60 ${expandedItineraries[circuit.id] ? 'text-white' : 'text-marine-blue'}`}>
                                {circuit.itinerary.length} étapes à découvrir
                              </p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all duration-500 ${expandedItineraries[circuit.id] ? 'text-white translate-x-1' : 'text-marine-navy/40 group-hover/btn:text-marine-blue'}`}>
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
                            >
                              <div className="relative pl-8 md:pl-12 py-6 space-y-8">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[15px] md:left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-marine-blue/40 via-marine-blue/20 to-transparent"></div>

                                {circuit.itinerary.map((step, j) => (
                                  <motion.div 
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
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
