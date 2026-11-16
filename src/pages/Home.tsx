import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CircuitCard from '../components/CircuitCard';
import { Circuit } from '../types';
import { Waves, ShieldCheck, Fuel, Ship, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  circuits: Circuit[];
  onSelectCircuit: (circuit: Circuit) => void;
}

const highlights = [
  {
    icon: Ship,
    title: 'Bateau 100 % privatisé',
    text: "Le Prestige 42 Flybridge rien que pour vous : jusqu'à 10 personnes, sans autres passagers.",
  },
  {
    icon: ShieldCheck,
    title: 'Capitaine professionnel',
    text: 'Christian, diplômé de la Marine Marchande, connaît chaque crique des Bouches de Bonifacio.',
  },
  {
    icon: Fuel,
    title: 'Carburant & skipper inclus',
    text: 'Un tarif clair à la journée, sans mauvaise surprise. Paddle, seabob et bouée tractée à bord.',
  },
  {
    icon: MapPin,
    title: 'Départ du port de Bonifacio',
    text: 'Îles Lavezzi, Cavallo, Roccapina, archipel de La Maddalena et Sardaigne à portée de proue.',
  },
];

export default function Home({ circuits, onSelectCircuit }: Props) {
  const selectedBoat = 'prestige' as const;
  const visibleCircuits = circuits.filter(c => !c.hidden && (!c.exclusiveBoat || c.exclusiveBoat === selectedBoat));

  return (
    <>
      <Hero />

      {/* Circuits Section */}
      <section id="circuits" aria-labelledby="circuits-title" className="py-20 md:py-24 px-6 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-marine-blue/5 border border-marine-blue/10 rounded-full text-marine-blue text-xs font-bold uppercase tracking-widest mb-4">
              <Waves size={14} aria-hidden="true" /> Nos Expériences
            </div>
            <h2 id="circuits-title" className="text-4xl md:text-5xl font-display font-bold mb-6 text-marine-navy">
              Excursions & Croisières
            </h2>
            <p className="text-marine-navy/75 max-w-2xl mx-auto font-light">
              Choisissez l'aventure qui vous ressemble : une journée aux îles Lavezzi, les criques sauvages de
              Roccapina, l'archipel de La Maddalena ou une croisière de plusieurs jours autour de la Corse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {circuits.length === 0
              ? [1, 2, 3].map((n) => (
                  <div key={n} aria-hidden="true" className="bg-white rounded-3xl overflow-hidden border border-marine-blue/10 shadow-lg animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-10 bg-gray-200 rounded-xl w-full mt-4"></div>
                    </div>
                  </div>
                ))
              : visibleCircuits.map((circuit, idx) => (
                  <motion.div
                    key={circuit.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(idx, 3) * 0.08 }}
                  >
                    <CircuitCard circuit={circuit} onView={onSelectCircuit} selectedBoat={selectedBoat} />
                  </motion.div>
                ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/nos-prestations"
              className="inline-flex items-center gap-2 font-bold text-marine-blue hover:text-marine-navy underline-offset-4 hover:underline"
            >
              Voir tous les tarifs et prestations <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Background Decorative Glow */}
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-marine-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Why us — gives visitors (and search engines) the key facts at a glance */}
      <section aria-labelledby="why-title" className="py-20 md:py-24 px-6 bg-marine-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 id="why-title" className="text-3xl md:text-4xl font-display font-bold mb-5">
              Votre excursion en bateau privé à Bonifacio
            </h2>
            <p className="text-white/80 font-light leading-relaxed">
              Croisières des Îles organise des sorties en mer privatisées avec skipper au départ de Bonifacio, en
              Corse du Sud. Falaises calcaires, grottes marines, lagons turquoise des Lavezzi : profitez des plus
              beaux mouillages de la Méditerranée à votre rythme.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Icon size={26} aria-hidden="true" className="text-marine-cyan mb-4" />
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-white/75 font-light leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-marine-cyan text-marine-ink rounded-full font-bold text-center hover:bg-white transition-colors"
            >
              Demander une disponibilité
            </Link>
            <Link
              to="/nos-bateaux"
              className="px-8 py-4 border border-white/30 text-white rounded-full font-bold text-center hover:bg-white/10 transition-colors"
            >
              Découvrir le bateau
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
