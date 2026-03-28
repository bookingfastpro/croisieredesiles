import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { getHero } from '../services/api';
import { HeroData } from '../types';

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      const data = await getHero();
      setHeroData(data);
    };
    fetchHero();
  }, []);

  if (!heroData) return null;

  return (
    <section className="relative min-h-screen md:h-screen w-full flex items-center justify-center overflow-hidden py-24 md:py-0">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroData.image} 
          alt="Ocean background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-marine-deep/60 via-marine-ocean/40 to-marine-deep"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-blue p-6 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
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
            transition={{ delay: 0.5, duration: 1 }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {heroData.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="#circuits"
              className="px-8 md:px-10 py-3 md:py-4 bg-marine-ocean hover:bg-marine-deep text-white rounded-full font-bold transition-all glow-blue hover:scale-105 text-base md:text-lg"
            >
              Découvrir les circuits
            </a>
            <a 
              href="#about"
              className="px-8 md:px-10 py-3 md:py-4 glass hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/20 text-base md:text-lg"
            >
              En savoir plus
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50 cursor-pointer"
        onClick={() => document.getElementById('circuits')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown size={32} />
      </motion.div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-marine-turquoise/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-marine-light/20 blur-[120px] rounded-full"></div>
    </section>
  );
}
