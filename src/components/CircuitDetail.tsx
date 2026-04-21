import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Info, Calendar, CheckCircle2 } from 'lucide-react';
import { Circuit } from '../types';

interface Props {
  circuit: Circuit;
  onClose: () => void;
}

export default function CircuitDetail({ circuit, onClose }: Props) {
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
        className="relative w-full h-full md:max-w-5xl md:max-h-[90vh] bg-white md:rounded-[2.5rem] rounded-none overflow-hidden border border-gray-200 shadow-2xl flex flex-col"
      >
        {/* Header: Image */}
        <div className="relative h-64 md:h-80 overflow-hidden shrink-0">
          <img 
            src={circuit.image} 
            alt={circuit.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-marine-ink via-marine-navy/20 to-transparent"></div>
          
          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-glow">{circuit.name}</h2>
              <div className="flex items-center gap-4 text-marine-cyan mt-2">
                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
                  <Calendar size={16} /> {circuit.duration}
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-xl border border-white/20">
              <span className="text-2xl font-bold text-white">{circuit.price}€</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 text-white transition-colors z-10 border border-white/20"
          >
            <MapPin className="rotate-45" size={20} />
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
            </div>

            {/* Right Column: Itinerary */}
            <div className="lg:col-span-2">
              <section>
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-marine-navy">
                  <MapPin size={20} /> Itinéraire détaillé
                </h3>
                <div className="grid gap-4">
                  {circuit.itinerary.map((step, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-marine-blue/5 transition-all">
                      <div className="w-8 h-8 rounded-full bg-marine-blue/20 flex items-center justify-center text-marine-blue text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-marine-navy/80 leading-relaxed font-light">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 py-4 bg-marine-blue hover:bg-marine-navy text-white rounded-2xl font-bold transition-all shadow-lg shadow-marine-blue/20 hover:scale-[1.02] active:scale-95">
              Réserver ce circuit
            </button>
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
