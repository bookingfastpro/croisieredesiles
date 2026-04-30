import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Clock, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-marine-ink">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80" 
            alt="Contact Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-marine-navy/40 via-marine-blue/30 to-marine-ink/80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-marine-cyan/10 border border-marine-cyan/20 rounded-full text-marine-cyan text-xs font-bold uppercase tracking-widest mb-6"
          >
            <MessageSquare size={14} /> Contactez-nous
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Préparons votre <span className="text-marine-cyan font-serif italic">évasion</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto font-light text-lg"
          >
            Une question ? Une demande particulière ? Notre équipe est à votre écoute pour organiser votre croisière idéale au départ de Bonifacio.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Contact Info Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-marine-navy/5 rounded-[2rem] border border-marine-blue/10 hover:border-marine-blue transition-all group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-marine-blue/10 flex items-center justify-center text-marine-blue mb-6 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-marine-navy">Téléphone</h3>
              <p className="text-marine-navy/60 text-sm mb-4 font-light flex-grow">Appelez-nous directement pour une réponse rapide.</p>
              <a href="tel:+33611818486" className="text-lg font-bold text-marine-blue hover:text-marine-navy transition-colors flex items-center gap-2 mt-auto">
                06 11 81 84 86
                <ChevronRight size={16} />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-marine-navy/5 rounded-[2rem] border border-marine-blue/10 hover:border-marine-blue transition-all group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-marine-blue/10 flex items-center justify-center text-marine-blue mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-marine-navy">Email</h3>
              <p className="text-marine-navy/60 text-sm mb-4 font-light flex-grow">Envoyez-nous vos demandes détaillées par courriel.</p>
              <a href="mailto:croisieresdesiles20169@gmail.com" className="text-sm font-bold text-marine-blue hover:text-marine-navy transition-colors break-all mt-auto">
                croisieresdesiles20169@gmail.com
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-marine-navy/5 rounded-[2rem] border border-marine-blue/10 hover:border-marine-blue transition-all group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-marine-blue/10 flex items-center justify-center text-marine-blue mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-marine-navy">Localisation</h3>
              <p className="text-marine-navy/60 text-sm mb-2 font-light flex-grow">Retrouvez-nous au port de Bonifacio.</p>
              <p className="text-sm font-bold text-marine-navy mt-auto">Quai d'honneur, 20169 Bonifacio</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 bg-marine-blue rounded-[2rem] text-white shadow-xl shadow-marine-blue/20 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-marine-cyan" />
                <h3 className="text-lg font-bold">Horaires</h3>
              </div>
              <div className="space-y-2 text-sm font-light opacity-90 flex-grow">
                <div className="flex justify-between">
                  <span>Lun - Dim</span>
                  <span className="font-bold">09:00 - 20:00</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest mt-4 opacity-60">Saison d'été (Avril - Octobre)</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Section or Additional Info */}
      <section className="py-24 bg-marine-navy/5 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-marine-navy mb-12">Où nous trouver ?</h2>
          <div className="aspect-video w-full rounded-[3rem] overflow-hidden border border-marine-blue/10 shadow-xl transition-all duration-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2983.473534571746!2d9.15585831544063!3d41.38722297926419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d960786968869b%3A0x40819a5e94a9a00!2sPort%20de%20Bonifacio!5e0!3m2!1sfr!2sfr!4v1650000000000!5m2!1sfr!2sfr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
