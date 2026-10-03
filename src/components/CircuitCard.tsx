import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Circuit } from '../types';

interface Props {
  circuit: Circuit;
  onView: (circuit: Circuit) => void;
  selectedBoat?: 'prestige' | 'pardo';
}

export default function CircuitCard({ circuit, onView, selectedBoat = 'prestige' }: Props) {
  const getInitialImage = () => {
    if (circuit.boatImages) {
      const boatImgs = selectedBoat === 'prestige' ? circuit.boatImages.prestige : circuit.boatImages.pardo;
      if (boatImgs && boatImgs.length > 0) return boatImgs[0];
    }
    return circuit.image || "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%208.jpg";
  };

  const [imgSrc, setImgSrc] = useState<string>(getInitialImage);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-marine-blue/10 transition-all duration-300 shadow-lg shadow-marine-navy/5 hover:shadow-2xl hover:border-marine-blue/30 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="h-60 sm:h-64 overflow-hidden relative bg-marine-navy/10 shrink-0">
        <motion.img 
          key={`${circuit.id}-${selectedBoat}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          src={imgSrc} 
          alt={circuit.name} 
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc(circuit.image || "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-30%20at%2013.05.08.jpeg")}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-marine-ink/60 via-transparent to-transparent opacity-70"></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-marine-blue/10 shadow-md">
           <Tag size={13} className="text-marine-blue" />
           <span className="text-xs sm:text-sm font-bold text-marine-navy">
             {circuit.category === 'circuit' ? 'À partir de 1800€' : 'Sur devis'}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-marine-blue mb-2.5">
            <Clock size={15} />
            <span className="text-xs font-bold uppercase tracking-widest">{circuit.duration}</span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-marine-navy group-hover:text-marine-blue transition-colors">
            {circuit.name}
          </h3>
          
          <p className="text-marine-navy/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
            {circuit.description}
          </p>

          {/* Locations list */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {circuit.locations.slice(0, 4).map((location, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-marine-blue/5 rounded-full text-marine-blue font-semibold border border-marine-blue/10">
                {location}
              </span>
            ))}
            {circuit.locations.length > 4 && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-marine-cyan/15 rounded-full text-marine-navy font-semibold border border-marine-cyan/25">
                +{circuit.locations.length - 4}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => onView(circuit)}
          className="w-full py-3 px-4 bg-marine-blue/5 hover:bg-marine-blue text-marine-blue hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-marine-blue/15 hover:border-marine-blue shadow-sm hover:shadow-lg hover:shadow-marine-blue/20 text-sm"
        >
          <span>Découvrir le circuit</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
