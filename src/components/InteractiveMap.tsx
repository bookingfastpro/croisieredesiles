import React from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Navigation, Compass } from 'lucide-react';
import { Circuit } from '../types';

interface Props {
  circuits: Circuit[];
}

export default function InteractiveMap({ circuits }: Props) {
  return (
    <section id="map" className="py-24 px-6 relative overflow-hidden bg-marine-mist/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/5 border border-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Navigation size={14} /> Exploration Visuelle
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">Nos Routes Maritimes</h2>
          <p className="text-marine-navy/70 max-w-2xl mx-auto font-light">
            Visualisez nos différents parcours et les points d'intérêt majeurs que nous explorerons ensemble.
          </p>
        </div>

        <div className="relative aspect-video w-full bg-marine-ink rounded-[3rem] border border-marine-blue/20 shadow-2xl overflow-hidden group">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-marine-ink">
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Mock Coastline (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
              <path 
                d="M0,100 C150,120 250,50 400,80 S600,200 800,150 S1000,250 1000,300 L1000,0 L0,0 Z" 
                fill="#0A2540" 
                className="opacity-30"
              />
              
              {/* Circuit Paths */}
              {circuits.map((circuit, idx) => {
                const colors = ['#0ea5e9', '#3b82f6', '#1e3a8a'];
                const pathData = idx === 0 
                  ? "M200,300 Q350,450 500,350 T800,400" 
                  : idx === 1 
                  ? "M150,250 C300,150 500,200 700,100" 
                  : "M400,500 L600,450 L750,550";
                
                return (
                  <motion.path
                    key={circuit.id}
                    d={pathData}
                    fill="none"
                    stroke={colors[idx % colors.length]}
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: idx * 0.5 }}
                    className="filter drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                  />
                );
              })}

              {/* Pins */}
              <circle cx="200" cy="300" r="6" fill="#0ea5e9" className="animate-pulse" />
              <circle cx="800" cy="400" r="6" fill="#3b82f6" />
              <circle cx="700" cy="100" r="6" fill="#0ea5e9" />
            </svg>
          </div>

          {/* Overlay Controls */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
            {circuits.map((circuit, idx) => (
              <div key={circuit.id} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10 hover:bg-white/20 cursor-pointer transition-all">
                <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-marine-cyan' : idx === 1 ? 'bg-marine-blue' : 'bg-marine-navy'}`}></div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">{circuit.name}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 max-w-xs">
            <div className="flex items-center gap-3 mb-2">
              <Compass className="text-marine-cyan animate-spin-slow" />
              <h4 className="font-display font-bold text-white">Navigation Interactive</h4>
            </div>
            <p className="text-[10px] text-white/80 leading-relaxed uppercase tracking-widest">
              Explorez les zones protégées et les sanctuaires marins que nous traversons.
            </p>
          </div>

          {/* Map Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20">
              <MapIcon size={48} className="text-marine-cyan animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-marine-blue/10 blur-[150px] rounded-full"></div>
    </section>
  );
}
