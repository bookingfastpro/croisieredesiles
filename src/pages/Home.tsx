import React from 'react';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import CircuitCard from '../components/CircuitCard';
import { Circuit } from '../types';
import { Waves } from 'lucide-react';

interface Props {
  circuits: Circuit[];
  onSelectCircuit: (circuit: Circuit) => void;
}

export default function Home({ circuits, onSelectCircuit }: Props) {
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-marine-ocean/5 border border-marine-ocean/10 rounded-full text-marine-ocean text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Waves size={14} className="animate-pulse" /> Nos Expériences
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-marine-deep">Circuits Touristiques</h2>
            <p className="text-marine-deep/70 max-w-2xl mx-auto font-light">
              Choisissez l'aventure qui vous ressemble. De la détente crépusculaire à l'exploration sauvage, 
              chaque route est une promesse d'émerveillement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {circuits.map((circuit, idx) => (
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
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-marine-ocean/5 blur-[180px] rounded-full pointer-events-none"></div>
      </section>
    </main>
  );
}
