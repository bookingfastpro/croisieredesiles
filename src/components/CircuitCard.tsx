import React from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Circuit } from '../types';

interface Props {
  circuit: Circuit;
  onView: (circuit: Circuit) => void;
}

export default function CircuitCard({ circuit, onView }: Props) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-marine-blue/10 transition-all duration-500 shadow-xl shadow-marine-navy/5 hover:shadow-2xl hover:shadow-marine-blue/10"
    >
      {/* Image Container */}
      <div className="h-64 overflow-hidden relative">
        <img 
          src={circuit.image} 
          alt={circuit.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-marine-ink/40 via-transparent to-transparent opacity-60"></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-marine-blue/10 shadow-lg">
           <Tag size={14} className="text-marine-cyan" />
           <span className="text-sm font-bold text-marine-navy">
             {circuit.category === 'circuit' ? 'À partir de 1800€' : 'Sur devis'}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-marine-cyan mb-3">
          <Clock size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">{circuit.duration}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-marine-navy group-hover:text-marine-blue transition-colors">
          {circuit.name}
        </h3>
        
        <p className="text-marine-navy/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
          {circuit.description}
        </p>

        {/* Locations list */}
        <div className="flex flex-wrap gap-2 mb-6">
          {circuit.locations.slice(0, 4).map((location, i) => (
            <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-marine-blue/5 rounded-full text-marine-blue/70 border border-marine-blue/10">
              {location}
            </span>
          ))}
          {circuit.locations.length > 4 && (
            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-marine-cyan/10 rounded-full text-marine-cyan border border-marine-cyan/20">
              +{circuit.locations.length - 4}
            </span>
          )}
        </div>

        <button 
          onClick={() => onView(circuit)}
          className="w-full py-3 bg-marine-blue/5 hover:bg-marine-blue text-marine-blue hover:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-marine-blue/10 hover:border-marine-blue shadow-sm hover:shadow-lg hover:shadow-marine-blue/20"
        >
          Voir le circuit
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
