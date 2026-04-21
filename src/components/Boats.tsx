import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wind, Users, Bed, Coffee, Tv, ShowerHead, Thermometer, Anchor } from 'lucide-react';
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
};

export default function Boats() {
  const [boats, setBoats] = useState<Boat[]>([]);

  useEffect(() => {
    const fetchBoats = async () => {
      const data = await getBoats();
      setBoats(data);
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
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-video">
                  <img 
                    src={boat.image} 
                    alt={boat.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marine-ink/60 to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-3xl font-display font-bold text-white">{boat.name}</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <p className="text-marine-navy/80 text-lg font-light leading-relaxed">
                  {boat.description}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {boat.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-marine-blue/10 hover:border-marine-blue transition-all group">
                      <div className="text-marine-blue group-hover:scale-110 transition-transform">{iconMap[spec.label] || <Anchor size={18} />}</div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-marine-navy/60">{spec.label}</div>
                        <div className="text-sm font-bold text-marine-navy">{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
