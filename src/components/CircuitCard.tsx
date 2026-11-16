import React, { useState } from 'react';
import { responsive } from '../utils/img';
import { m as motion } from 'motion/react';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/price';
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
          {...responsive(imgSrc, [480, 640, 828], '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw')}
          alt={`${circuit.name} – excursion en bateau privé`}
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc(circuit.image || "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-30%20at%2013.05.08.jpeg")}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-marine-ink/60 via-transparent to-transparent opacity-70"></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-white/95 md:backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-marine-blue/10 shadow-md">
           <Tag size={13} aria-hidden="true" className="text-marine-blue" />
           <span className="text-xs sm:text-sm font-bold text-marine-navy">
             {formatPrice(circuit)}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-marine-blue mb-2.5">
            <Clock size={15} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest">{circuit.duration}</span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-marine-navy group-hover:text-marine-blue transition-colors">
            {circuit.name}
          </h3>
          
          <p className="text-marine-navy/70 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
            {circuit.description}
          </p>

          {/* Locations list */}
          <ul className="flex flex-wrap gap-1.5 mb-6" aria-label="Lieux visités">
            {circuit.locations.slice(0, 4).map((location, i) => (
              <li key={i} className="text-[11px] uppercase tracking-wider px-2.5 py-1 bg-marine-blue/5 rounded-full text-marine-blue font-semibold border border-marine-blue/10">
                {location}
              </li>
            ))}
            {circuit.locations.length > 4 && (
              <li aria-label={`et ${circuit.locations.length - 4} autres lieux`} className="text-[11px] uppercase tracking-wider px-2 py-1 bg-marine-cyan/15 rounded-full text-marine-navy font-semibold border border-marine-cyan/25">
                +{circuit.locations.length - 4}
              </li>
            )}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onView(circuit)}
          aria-haspopup="dialog"
          aria-label={`Découvrir le circuit ${circuit.name}`}
          className="w-full py-3 px-4 bg-marine-blue/5 hover:bg-marine-blue text-marine-blue hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-marine-blue/15 hover:border-marine-blue shadow-sm hover:shadow-lg hover:shadow-marine-blue/20 text-sm"
        >
          <span>Découvrir le circuit</span>
          <ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
