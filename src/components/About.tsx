import React from 'react';
import { motion } from 'motion/react';
import { Shield, Anchor, Waves, Award, GraduationCap, Heart, Users } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: <Shield size={24} />, label: 'Sécurité', value: '100%', desc: 'Équipements certifiés' },
    { icon: <Anchor size={24} />, label: 'Expertise', value: 'Capitaine', desc: 'Diplômé Marine Marchande' },
    { icon: <Waves size={24} />, label: 'Expérience', value: '20+ ans', desc: 'Navigation locale' },
    { icon: <Award size={24} />, label: 'Qualité', value: 'Excellence', desc: 'Service sur mesure' },
  ];

  return (
    <section id="about" className="py-24 px-6 relative bg-marine-deep/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-marine-ocean text-xs font-bold uppercase tracking-widest mb-6">
              <Users size={14} /> Qui sommes-nous ?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-marine-deep">
              À la rencontre de <br />
              <span className="text-marine-ocean">Monsieur DUMAS</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1 text-marine-ocean"><Heart size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-marine-deep mb-2">Vie Personnelle & Passions</h3>
                  <p className="text-marine-deep/80 font-light leading-relaxed">
                    Natif de la région et passionné par l'univers maritime depuis son plus jeune âge, Mr Dumas a fait de la mer son terrain de jeu et son bureau. Amateur de photographie sous-marine et fervent défenseur de l'écosystème corse, il partage son temps entre la navigation et ses centres d'intérêt pour la nature sauvage et les traditions locales.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-marine-ocean"><GraduationCap size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-marine-deep mb-2">Cursus Professionnel & Diplômes</h3>
                  <p className="text-marine-deep/80 font-light leading-relaxed">
                    Fort d'un cursus solide au sein de la Marine Marchande, Mr Dumas est titulaire de tous les diplômes de commandement requis pour la navigation professionnelle. Son parcours l'a mené à naviguer sur divers types de navires avant de se consacrer entièrement à la plaisance de luxe et au partage de sa passion avec une clientèle exigeante.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-3xl border border-marine-ocean/20 hover:border-marine-ocean transition-all">
                  <div className="text-marine-ocean mb-4">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1 text-marine-deep">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-marine-deep/80 mb-1">{stat.label}</div>
                  <div className="text-[10px] text-marine-deep/60">{stat.desc}</div>
                </div>
              ))}
            </div>
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
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" 
                alt="Mr Dumas" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-marine-ocean/20 mix-blend-overlay"></div>
            </div>
            
            {/* Floating Glass Card */}
            <div className="absolute -bottom-10 -left-10 z-20 glass-blue p-8 rounded-3xl border border-white/20 backdrop-blur-2xl max-w-xs hidden md:block">
              <p className="italic text-white/80 mb-4 font-light">
                "Naviguer n'est pas seulement un métier, c'est un art de vivre que je m'efforce de transmettre à chaque sortie."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-marine-light flex items-center justify-center text-white font-bold">D</div>
                <div>
                  <div className="font-bold text-sm">Mr Dumas</div>
                  <div className="text-[10px] uppercase tracking-widest text-marine-turquoise">Capitaine & Fondateur</div>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-marine-turquoise/10 blur-[100px] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
