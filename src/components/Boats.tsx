import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Wind, Users, Bed, Coffee, Tv, ShowerHead, Thermometer, Anchor, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getBoats } from '../services/api';
import { Boat } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  "Moteur": <Wind size={18} />,
  "Capacité": <Users size={18} />,
  "Chambres": <Bed size={18} />,
  "Cuisine": <Coffee size={18} />,
  "Confort": <Thermometer size={18} />,
  "Divertissement": <Tv size={18} />,
  "Douchette": <ShowerHead size={18} />,
  "Vitesse": <Wind size={18} />,
  "Style": <Users size={18} />,
  "Design": <Anchor size={18} />,
  "Longueur": <Anchor size={18} />,
  "Largeur": <Anchor size={18} />,
  "Équipements": <Coffee size={18} />,
};

function BoatGallery({ images, name }: { images: string[], name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group/gallery h-full select-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${name} - Vue ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-marine-ink/70 via-transparent to-transparent pointer-events-none"></div>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-black/30 sm:bg-white/10 backdrop-blur-md rounded-full text-white opacity-90 sm:opacity-0 sm:group-hover/gallery:opacity-100 transition-opacity hover:bg-white/25 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-black/30 sm:bg-white/10 backdrop-blur-md rounded-full text-white opacity-90 sm:opacity-0 sm:group-hover/gallery:opacity-100 transition-opacity hover:bg-white/25 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à la photo ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-5' : 'bg-white/50 w-2'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 px-3 py-1.5 bg-marine-blue/90 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 shadow-md">
        <Search size={11} /> Galerie photos
      </div>
    </div>
  );
}

export default function Boats() {
  const [boats, setBoats] = useState<Boat[]>(() => {
    try {
      const stored = localStorage.getItem("cache_boats");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchBoats = async () => {
      const data = await getBoats();
      if (data && data.length > 0) {
        setBoats(data);
      }
    };
    fetchBoats();
  }, []);

  return (
    <section id="boats" className="py-24 px-6 bg-marine-pearl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/5 border border-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
            <Anchor size={14} /> Notre Flotte
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Nos Bateaux d'Exception</h2>
          <p className="text-marine-navy/70 max-w-2xl mx-auto font-light">
            Découvrez nos unités de prestige, entretenues avec le plus grand soin pour vous garantir confort, sécurité et élégance. 
          </p>
        </div>

        <div className="space-y-24">
          {boats.map((boat, idx) => (
            <div key={boat.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2"
              >
                <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-video border border-marine-blue/5">
                  <BoatGallery images={boat.images || [boat.image]} name={boat.name} />
                  
                  <div className="absolute bottom-8 left-8 transition-transform group-hover:translate-x-2">
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">{boat.name}</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 space-y-8"
              >
                <div className="space-y-4">
                  <div className="h-1 w-12 bg-marine-blue rounded-full"></div>
                  <p className="text-marine-navy/80 text-lg font-light leading-relaxed">
                    {boat.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {boat.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-marine-blue/20 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-marine-blue/5 flex items-center justify-center text-marine-blue group-hover:bg-marine-blue group-hover:text-white transition-all duration-500">
                        {iconMap[spec.label] || <Anchor size={20} />}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-marine-navy/40 font-bold mb-1">{spec.label}</div>
                        <div className="text-base font-bold text-marine-navy">{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {boat.options && boat.options.length > 0 && (
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-marine-navy uppercase tracking-widest flex items-center gap-2">
                       <Coffee size={16} className="text-marine-blue" /> Prestations & Options à bord
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {boat.options.map((option, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-marine-navy/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-marine-blue"></div>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link to="/contact" className="sm:w-auto w-full">
                  <button className="px-8 py-4 bg-marine-navy text-white rounded-2xl font-bold hover:bg-marine-blue transition-all shadow-lg hover:shadow-marine-blue/25 w-full">
                    Disponibilité & Tarifs
                  </button>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
