import React from 'react';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import CircuitCard from '../components/CircuitCard';
import { Circuit } from '../types';
import { Waves, Sparkles } from 'lucide-react';

interface Props {
  circuits: Circuit[];
  onSelectCircuit: (circuit: Circuit) => void;
}

export default function Home({ circuits, onSelectCircuit }: Props) {
  const [selectedBoat, setSelectedBoat] = React.useState<'prestige' | 'pardo'>('prestige');

  return (
    <main>
      <Hero />

      {/* Circuits Section */}
      <section id="circuits" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/5 border border-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Waves size={14} className="animate-pulse" /> Nos Expériences
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-marine-navy">Excursions & Croisières</h2>
            <p className="text-marine-navy/70 max-w-2xl mx-auto font-light mb-10">
              Choisissez l'aventure qui vous ressemble. De la détente crépusculaire à l'exploration sauvage, 
              chaque route est une promesse d'émerveillement.
            </p>

            {/* Boat Selection Toggle */}
            <div className="flex flex-col items-center gap-4 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-marine-navy/40">Choisir votre navire</span>
              <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                <button
                  onClick={() => setSelectedBoat('prestige')}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    selectedBoat === 'prestige'
                      ? 'bg-marine-navy text-white shadow-lg shadow-marine-navy/20 active:scale-95'
                      : 'text-marine-navy/50 hover:text-marine-navy'
                  }`}
                >
                  <Sparkles size={14} /> Prestige 42 Flybridge
                </button>
                <button
                  onClick={() => setSelectedBoat('pardo')}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedBoat === 'pardo'
                      ? 'bg-marine-navy text-white shadow-lg shadow-marine-navy/20 active:scale-95'
                      : 'text-marine-navy/50 hover:text-marine-navy'
                  }`}
                >
                  SAXDOR 320
                </button>
              </div>
              {selectedBoat === 'prestige' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-marine-cyan uppercase tracking-widest flex items-center gap-2"
                >
                  <Sparkles size={12} /> Bateau Recommandé
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {circuits
              .filter(c => !c.exclusiveBoat || c.exclusiveBoat === selectedBoat)
              .map((circuit, idx) => (
                <motion.div
                  key={circuit.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <CircuitCard 
                    circuit={circuit} 
                    onView={onSelectCircuit} 
                    selectedBoat={selectedBoat}
                  />
                </motion.div>
              ))}
          </div>
        </div>

        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-marine-blue/5 blur-[180px] rounded-full pointer-events-none"></div>
      </section>
    </main>
  );
}
