import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getHero, DEFAULT_HERO } from '../services/api';
import { HeroData } from '../types';

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroData>(() => {
    try {
      const stored = localStorage.getItem("cache_hero");
      return stored ? JSON.parse(stored) : DEFAULT_HERO;
    } catch {
      return DEFAULT_HERO;
    }
  });

  useEffect(() => {
    const fetchHero = async () => {
      const data = await getHero();
      if (data) {
        setHeroData(data);
      }
    };
    fetchHero();
  }, []);

  return (
    <section className="relative min-h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16 md:py-0">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroData.image} 
          alt="Croisière des îles Bonifacio en mer" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-marine-navy/40 via-marine-blue/20 to-marine-ink/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-dark p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-white/15 backdrop-blur-xl mx-auto shadow-2xl"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight text-white leading-tight"
          >
            {heroData.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < heroData.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-white/85 mb-6 md:mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {heroData.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <a 
              href="#circuits"
              className="px-6 md:px-8 py-3 bg-marine-blue hover:bg-marine-navy text-white rounded-full font-bold transition-all shadow-lg shadow-marine-blue/25 hover:scale-105 text-sm sm:text-base text-center"
            >
              Découvrir les circuits
            </a>
            <Link 
              to="/contact"
              className="px-6 md:px-8 py-3 glass hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/20 text-sm sm:text-base text-center"
            >
              Nous contacter
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white cursor-pointer transition-colors"
        onClick={() => document.getElementById('circuits')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Faire défiler vers le bas"
      >
        <ChevronDown size={32} />
      </motion.div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-marine-cyan/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-marine-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
}
