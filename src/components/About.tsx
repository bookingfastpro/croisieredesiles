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
              <Users size={14} /> Qui sommes-nous ?
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight text-marine-navy">
              À la rencontre de <br />
              <span className="text-marine-blue">Christian</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1 text-marine-blue"><Heart size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-marine-navy mb-2">Vie Personnelle & Passions</h3>
                  <p className="text-marine-navy/80 font-light leading-relaxed">
                    Natif de la région et passionné par l'univers maritime depuis son plus jeune âge, Christian a fait de la mer son terrain de jeu et son bureau. Amateur de photographie sous-marine et fervent défenseur de l'écosystème corse, il partage son temps entre la navigation et ses centres d'intérêt pour la nature sauvage et les traditions locales.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 text-marine-blue"><GraduationCap size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-marine-navy mb-2">Cursus Professionnel & Diplômes</h3>
                  <p className="text-marine-navy/80 font-light leading-relaxed">
                    Fort d'un cursus solide au sein de la Marine Marchande, Christian est titulaire de tous les diplômes de commandement requis pour la navigation professionnelle. Son parcours l'a mené à naviguer sur divers types de navires avant de se consacrer entièrement à la plaisance de luxe et au partage de sa passion avec une clientèle exigeante.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-marine-blue/10 hover:border-marine-blue transition-all group">
                  <div className="text-marine-blue mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1 text-marine-navy">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-marine-navy/80 mb-1">{stat.label}</div>
                  <div className="text-[10px] text-marine-navy/60">{stat.desc}</div>
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
                src="https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/0c435c87-50ff-437d-b612-19832209e1d6%20(1).jpg" 
                alt="Christian" 
                className="w-full h-full object-cover transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Glass Card */}
            <div className="absolute -bottom-10 -left-10 z-20 glass-dark p-8 rounded-3xl border border-white/20 backdrop-blur-2xl max-w-xs hidden md:block">
              <p className="font-serif italic text-white/80 mb-4 font-light">
                "Naviguer n'est pas seulement un métier, c'est un art de vivre que je m'efforce de transmettre à chaque sortie."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-marine-blue flex items-center justify-center text-white font-bold">C</div>
                <div>
                  <div className="font-bold text-sm text-white">Christian</div>
                  <div className="text-[10px] uppercase tracking-widest text-marine-cyan">Capitaine & Fondateur</div>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-marine-cyan/10 blur-[100px] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
