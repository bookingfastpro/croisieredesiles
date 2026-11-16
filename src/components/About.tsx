import React from 'react';
import { motion } from 'motion/react';
import { Shield, Anchor, Waves, Award, GraduationCap, Heart, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const STAT_ICONS = [Shield, Anchor, Waves, Award];

export default function About() {
  const { about } = useSettings().settings;
  const stats = about.stats.map((stat, i) => {
    const Icon = STAT_ICONS[i % STAT_ICONS.length];
    return { ...stat, icon: <Icon size={24} /> };
  });

  return (
    <section id="about" className="py-24 px-6 relative bg-marine-mist/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/5 border border-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-6">
              <Users size={14} aria-hidden="true" /> Qui sommes-nous ?
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight text-marine-navy">
              {about.title} <br />
              <span className="text-marine-blue">{about.highlight}</span>, votre capitaine à Bonifacio
            </h1>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1 text-marine-blue" aria-hidden="true"><Heart size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-marine-navy mb-2">{about.personalTitle}</h2>
                  <p className="text-marine-navy/80 font-light leading-relaxed">{about.personalText}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-marine-blue" aria-hidden="true"><GraduationCap size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-marine-navy mb-2">{about.careerTitle}</h2>
                  <p className="text-marine-navy/80 font-light leading-relaxed">{about.careerText}</p>
                </div>
              </div>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <li key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-marine-blue/10 hover:border-marine-blue transition-all group">
                  <div className="text-marine-blue mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1 text-marine-navy">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-marine-navy/80 mb-1">{stat.label}</div>
                  <div className="text-xs text-marine-navy/75">{stat.desc}</div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl aspect-[4/5]">
              <img 
                src={about.photo}
                alt="Christian, capitaine et fondateur de Croisières des Îles à Bonifacio" 
                className="w-full h-full object-cover transition-all duration-700"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Glass Card */}
            <figure className="absolute -bottom-10 -left-10 z-20 bg-marine-navy/90 p-8 rounded-3xl border border-white/20 backdrop-blur-2xl max-w-xs hidden md:block">
              <blockquote className="font-serif italic text-white/90 mb-4">
                « {about.quote} »
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div aria-hidden="true" className="w-10 h-10 rounded-full bg-marine-blue flex items-center justify-center text-white font-bold">{about.signature.charAt(0)}</div>
                <div>
                  <div className="font-bold text-sm text-white">{about.signature}</div>
                  <div className="text-[11px] uppercase tracking-widest text-marine-mist">{about.signatureRole}</div>
                </div>
              </figcaption>
            </figure>

            {/* Decorative Glow */}
            <div aria-hidden="true" className="absolute -top-20 -right-20 w-80 h-80 bg-marine-cyan/10 blur-[100px] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
