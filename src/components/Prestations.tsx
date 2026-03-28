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
    title: "Sortie Coucher de Soleil",
    icon: <Sun size={24} />,
    description: "Vivez le moment magique où le ciel s'embrase. Une navigation paisible pour terminer la journée en beauté.",
    details: ["Départ 18h30", "Apéritif inclus", "Ambiance musicale", "Idéal pour les couples"]
  },
  {
    title: "Soirée Feux d'Artifice",
    icon: <Sparkles size={24} />,
    description: "Admirez les spectacles pyrotechniques depuis le meilleur point de vue : la mer. Une expérience féerique et exclusive.",
    details: ["Horaires selon événement", "Vue imprenable", "Champagne à bord", "Places limitées"]
  },
  {
    title: "Croisière avec Équipage",
    icon: <Ship size={24} />,
    description: "Pour un confort absolu, optez pour une croisière avec personnel de bord dédié à votre service.",
    details: ["4 personnes max", "Skipper inclus", "Personnel de bord (sur demande)", "Service personnalisé"]
  }
];

export default function Prestations() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [expandedItineraries, setExpandedItineraries] = useState<Record<string, boolean>>({});

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
    <section id="prestations" className="py-24 px-6 bg-white text-marine-deep relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-marine-turquoise/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-marine-light/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-ocean/10 rounded-full text-marine-ocean text-xs font-bold uppercase tracking-widest mb-4">
            <Euro size={14} /> Nos Prestations
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-marine-deep">Tarifs & Services</h2>
          <p className="text-marine-deep/80 max-w-2xl mx-auto font-light text-sm sm:text-base">
            Toutes nos prestations sont basées sur la privatisation pour vous offrir une expérience intime et exclusive.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-24">
          {/* Rates Table */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-2xl shadow-marine-deep/5"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-3 text-marine-deep">
              <Calendar className="text-marine-ocean" /> Location à la journée
            </h3>
            <div className="space-y-4 md:space-y-6">
              {rates.map((rate, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-marine-ocean/5 transition-all group gap-2 sm:gap-0">
                  <span className="text-base sm:text-lg font-medium text-marine-deep/80">{rate.month}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-marine-ocean">{rate.price}</span>
                    <span className="text-[10px] text-marine-deep/60 uppercase tracking-widest font-bold">TTC</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs sm:text-sm text-marine-deep/60 italic text-center">
              * Tarifs incluant le carburant et le skipper professionnel.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:border-marine-turquoise/50 transition-all group"
              >
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-marine-ocean/10 flex items-center justify-center text-marine-ocean group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2 text-marine-deep">{service.title}</h4>
                    <p className="text-marine-deep/80 text-sm font-light mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {service.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-marine-ocean font-bold">
                          <div className="w-1 h-1 rounded-full bg-marine-ocean"></div>
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
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-ocean/10 rounded-full text-marine-ocean text-xs font-bold uppercase tracking-widest mb-4">
              <Map size={14} /> Nos Circuits
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-marine-deep">Suggestions d'Itinéraires</h2>
            <p className="text-marine-deep/80 max-w-2xl mx-auto font-light text-sm sm:text-base">
              Découvrez nos parcours exclusifs au départ de Bonifacio. Des itinéraires pensés pour vous faire vivre le meilleur de la Corse et de la Sardaigne.
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {circuits.map((circuit, i) => (
              <motion.div
                key={circuit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-marine-deep via-marine-deep/20 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                        <div>
                          <div className="flex items-center gap-2 text-marine-turquoise mb-2 md:mb-3 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold">
                            <Clock size={14} className="md:w-4 md:h-4" /> {circuit.duration}
                          </div>
                          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow leading-tight">{circuit.name}</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 self-start md:self-auto">
                          <span className="text-marine-turquoise text-[10px] md:text-xs font-bold uppercase tracking-widest block mb-0.5 md:mb-1">À partir de</span>
                          <span className="text-xl md:text-2xl font-bold text-white">{circuit.price}€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 sm:p-8 md:p-12 bg-white">
                    <p className="text-marine-deep/70 font-light mb-8 md:mb-12 leading-relaxed text-base md:text-lg max-w-4xl">
                      {circuit.longDescription}
                    </p>

                    <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                      <div className="lg:col-span-1 space-y-6 md:space-y-8">
                        <div className="space-y-4 md:space-y-6">
                          <h4 className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-marine-ocean font-bold flex items-center gap-2">
                            <MapPin size={14} className="md:w-4 md:h-4" /> Lieux clés
                          </h4>
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            {circuit.locations.map((location, j) => (
                              <span key={j} className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 rounded-lg md:rounded-xl text-[10px] md:text-xs font-medium text-marine-deep/80 border border-gray-100 hover:bg-marine-ocean/10 transition-colors">
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          <h4 className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-marine-ocean font-bold flex items-center gap-2">
                            <Ship size={14} className="md:w-4 md:h-4" /> Infos Pratiques
                          </h4>
                          <div className="grid gap-2 md:gap-3">
                            {circuit.practicalInfos.map((info, j) => (
                              <div key={j} className="flex items-start gap-3 text-xs md:text-sm text-marine-deep/80 italic">
                                <div className="w-1.5 h-1.5 rounded-full bg-marine-ocean mt-1.5 shrink-0"></div>
                                {info}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <button 
                          onClick={() => toggleItinerary(circuit.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group/btn ${
                            expandedItineraries[circuit.id] 
                              ? 'bg-marine-ocean/5 border-marine-ocean shadow-inner' 
                              : 'bg-gray-50 border-gray-100 hover:border-marine-ocean hover:bg-marine-ocean/5 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedItineraries[circuit.id] ? 'bg-marine-ocean text-white' : 'bg-marine-ocean/10 text-marine-ocean'}`}>
                              <ChevronRight size={18} className={`transition-transform duration-300 ${expandedItineraries[circuit.id] ? 'rotate-90' : ''}`} />
                            </div>
                            <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-marine-deep font-bold">
                              Itinéraire détaillé
                            </h4>
                          </div>
                          <div className={`flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors ${expandedItineraries[circuit.id] ? 'text-marine-ocean' : 'text-marine-deep/40 group-hover/btn:text-marine-ocean'}`}>
                            {expandedItineraries[circuit.id] ? 'Réduire' : 'Déployer'}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${expandedItineraries[circuit.id] ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedItineraries[circuit.id] && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="overflow-hidden"
                            >
                              <div className="grid sm:grid-cols-2 gap-3 md:gap-4 pt-4">
                                {circuit.itinerary.map((step, j) => (
                                  <motion.div 
                                    key={j}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: j * 0.05 }}
                                    className="flex gap-3 md:gap-4 p-4 md:p-5 bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-marine-ocean/20 transition-all group"
                                  >
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-marine-ocean/10 flex items-center justify-center text-marine-ocean text-xs md:text-sm font-bold flex-shrink-0 group-hover:bg-marine-ocean group-hover:text-white transition-all">
                                      {j + 1}
                                    </div>
                                    <p className="text-xs md:text-sm text-marine-deep/80 leading-relaxed font-light">
                                      {step}
                                    </p>
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
