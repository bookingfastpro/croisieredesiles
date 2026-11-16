import React, { useState } from 'react';
import { ChevronDown, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Boat, Circuit, HeroData, SiteSettings } from '../types';
import { PAGES } from '../seo';
import { formatPrice } from '../utils/price';
import { deleteImage } from '../services/api';
import {
  Button, Card, GalleryField, ImageField, ItemControls, SectionHeader, Select, StringList, TextArea, TextInput, Thumb, Toggle,
  UploadButton, move,
} from './ui';

export interface Draft {
  circuits: Circuit[];
  hero: HeroData;
  boats: Boat[];
  settings: SiteSettings;
}

type Update = (fn: (d: Draft) => Draft) => void;
interface SectionProps {
  draft: Draft;
  update: Update;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ------------------------------------------------------------------ */
/* Accueil                                                              */
/* ------------------------------------------------------------------ */

export function HomeSection({ draft, update }: SectionProps) {
  const set = (field: keyof HeroData, value: string) => update(d => ({ ...d, hero: { ...d.hero, [field]: value } }));
  return (
    <>
      <SectionHeader title="Page d'accueil" description="Le grand bandeau en haut de la page d'accueil : la première chose que voient vos visiteurs." />
      <Card title="Bandeau principal">
        <TextArea label="Titre" rows={2} value={draft.hero.title} onChange={v => set('title', v)} hint="Court et percutant. Allez à la ligne pour couper le titre en deux." />
        <TextArea label="Sous-titre" rows={3} value={draft.hero.subtitle} onChange={v => set('subtitle', v)} counter={200} hint="Une ou deux phrases pour donner envie." />
        <ImageField label="Photo de fond" value={draft.hero.image} onChange={v => set('image', v)} hint="Photo horizontale de bonne qualité (le bateau en mer, une crique…)." />
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Excursions & croisières                                              */
/* ------------------------------------------------------------------ */

function CircuitEditor({ circuit, onChange }: { circuit: Circuit; onChange: (c: Circuit) => void }) {
  const set = <K extends keyof Circuit>(field: K, value: Circuit[K]) => onChange({ ...circuit, [field]: value });
  const gallery = circuit.boatImages?.prestige ?? [];
  const setGallery = (images: string[]) =>
    onChange({
      ...circuit,
      image: images[0] || circuit.image,
      boatImages: { prestige: images, pardo: circuit.boatImages?.pardo ?? [] },
    });

  return (
    <div className="space-y-6 pt-5 border-t border-slate-100">
      <div className="grid md:grid-cols-2 gap-5">
        <TextInput label="Nom" value={circuit.name} onChange={v => set('name', v)} />
        <TextInput label="Durée affichée" value={circuit.duration} onChange={v => set('duration', v)} placeholder="Journée, 7 jours…" />
        <Select label="Type" value={circuit.category} onChange={v => set('category', v as Circuit['category'])}
          options={[{ value: 'circuit', label: 'Excursion (à la journée)' }, { value: 'croisiere', label: 'Croisière (plusieurs jours)' }]} />
        <div className="space-y-3">
          <TextInput label="Prix « à partir de » (€)" type="number" value={circuit.priceOnRequest ? '' : circuit.price ?? ''}
            disabled={circuit.priceOnRequest} onChange={v => set('price', v === '' ? undefined : Number(v))}
            hint={`Affiché sur le site : « ${formatPrice(circuit)} »`} />
          <Toggle label="Prix sur devis" checked={!!circuit.priceOnRequest} onChange={v => set('priceOnRequest', v)} />
        </div>
      </div>

      <TextArea label="Résumé (cartes de la page d'accueil)" rows={2} value={circuit.description} onChange={v => set('description', v)} counter={140} />
      <TextArea label="Description complète" rows={5} value={circuit.longDescription} onChange={v => set('longDescription', v)} />

      <GalleryField label="Photos" images={gallery.length ? gallery : circuit.image ? [circuit.image] : []} onChange={setGallery}
        hint="La première photo sert de photo principale. Utilisez les flèches pour changer l'ordre." />

      <StringList label="Itinéraire (étapes)" items={circuit.itinerary} onChange={v => set('itinerary', v)} multiline addLabel="Ajouter une étape" />
      <div className="grid md:grid-cols-2 gap-6">
        <StringList label="Lieux clés" items={circuit.locations} onChange={v => set('locations', v)} addLabel="Ajouter un lieu" />
        <StringList label="Infos pratiques" items={circuit.practicalInfos} onChange={v => set('practicalInfos', v)} addLabel="Ajouter une info" />
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <Toggle label="Afficher la grille des tarifs saisonniers" hint="Visible sous ce circuit sur la page Prestations (tarifs modifiables dans « Tarifs & prestations »)."
          checked={circuit.showSeasonalRates ?? (circuit.name.includes('Lavezzi') || circuit.name.includes('Roccapina'))}
          onChange={v => set('showSeasonalRates', v)} />
        <Toggle label="Masquer du site" hint="Le circuit reste enregistré mais n'est plus visible par les visiteurs (brouillon)."
          checked={!!circuit.hidden} onChange={v => set('hidden', v)} />
      </div>
    </div>
  );
}

export function CircuitsSection({ draft, update }: SectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const setCircuits = (fn: (c: Circuit[]) => Circuit[]) => update(d => ({ ...d, circuits: fn(d.circuits) }));

  const add = () => {
    const c: Circuit = {
      id: newId(),
      name: 'Nouvelle excursion',
      duration: 'Journée',
      price: 1800,
      priceOnRequest: false,
      category: 'circuit',
      description: '',
      longDescription: '',
      image: draft.hero.image,
      itinerary: ['Départ du port de Bonifacio', 'Retour Bonifacio'],
      locations: ['Bonifacio'],
      practicalInfos: ['Skipper inclus'],
      coordinates: [{ lat: 41.3875, lng: 9.1561 }],
      boatImages: { prestige: [], pardo: [] },
      hidden: true,
    };
    setCircuits(list => [...list, c]);
    setOpenId(c.id);
  };

  return (
    <>
      <SectionHeader
        title="Excursions & croisières"
        description="Les sorties proposées sur l'accueil et la page Prestations. L'ordre ici est l'ordre d'affichage sur le site."
        action={<Button variant="primary" onClick={add}><Plus size={18} aria-hidden="true" /> Nouvelle excursion</Button>}
      />
      <ul className="space-y-4">
        {draft.circuits.map((circuit, i) => {
          const open = openId === circuit.id;
          return (
            <li key={circuit.id} className={`bg-white rounded-2xl border shadow-sm p-4 md:p-5 ${circuit.hidden ? 'border-dashed border-slate-300' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button type="button" onClick={() => setOpenId(open ? null : circuit.id)} aria-expanded={open}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left">
                  <Thumb src={circuit.boatImages?.prestige?.[0] || circuit.image} className={`w-20 h-16 rounded-lg shrink-0 ${circuit.hidden ? 'opacity-50' : ''}`} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 truncate">{circuit.name}</span>
                      {circuit.hidden && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">Masqué</span>}
                    </span>
                    <span className="block text-sm text-slate-500">
                      {circuit.category === 'croisiere' ? 'Croisière' : 'Excursion'} · {circuit.duration} · {formatPrice(circuit)}
                    </span>
                  </span>
                  <ChevronDown size={20} aria-hidden="true" className={`ml-auto shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <Button size="sm" variant="ghost" title={circuit.hidden ? 'Afficher sur le site' : 'Masquer du site'}
                    onClick={() => setCircuits(list => list.map(c => (c.id === circuit.id ? { ...c, hidden: !c.hidden } : c)))}>
                    {circuit.hidden ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </Button>
                  <Button size="sm" variant="ghost" title="Dupliquer"
                    onClick={() => setCircuits(list => {
                      const copy = { ...structuredClone(circuit), id: newId(), name: `${circuit.name} (copie)`, hidden: true };
                      const next = [...list];
                      next.splice(i + 1, 0, copy);
                      return next;
                    })}>
                    <Copy size={16} aria-hidden="true" />
                  </Button>
                  <ItemControls index={i} length={draft.circuits.length}
                    onMove={dlt => setCircuits(list => move(list, i, dlt))}
                    onRemove={() => { if (confirm(`Supprimer définitivement « ${circuit.name} » ?`)) setCircuits(list => list.filter(c => c.id !== circuit.id)); }} />
                </div>
              </div>
              {open && (
                <div className="mt-5">
                  <CircuitEditor circuit={circuit} onChange={c => setCircuits(list => list.map(x => (x.id === c.id ? c : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Bateaux                                                              */
/* ------------------------------------------------------------------ */

export function BoatsSection({ draft, update }: SectionProps) {
  const setBoat = (id: string, fn: (b: Boat) => Boat) => update(d => ({ ...d, boats: d.boats.map(b => (b.id === id ? fn(b) : b)) }));
  return (
    <>
      <SectionHeader title="Bateau" description="Les informations affichées sur la page « Nos bateaux »."
        action={
          <Button onClick={() => update(d => ({ ...d, boats: [...d.boats, { id: newId(), name: 'Nouveau bateau', description: '', image: '', images: [], specs: [], options: [] }] }))}>
            <Plus size={18} aria-hidden="true" /> Ajouter un bateau
          </Button>
        } />
      <div className="space-y-6">
        {draft.boats.map(boat => (
          <Card key={boat.id} title={boat.name}>
            <TextInput label="Nom du bateau" value={boat.name} onChange={v => setBoat(boat.id, b => ({ ...b, name: v }))} />
            <TextArea label="Description" rows={4} value={boat.description} onChange={v => setBoat(boat.id, b => ({ ...b, description: v }))} />
            <GalleryField label="Photos du bateau" images={boat.images?.length ? boat.images : boat.image ? [boat.image] : []}
              onChange={imgs => setBoat(boat.id, b => ({ ...b, images: imgs, image: imgs[0] || '' }))}
              hint="La première photo est la photo principale." />

            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">Caractéristiques</p>
              <p className="text-xs text-slate-500 mb-2">Ex. : Longueur → 11.98m, Capacité → 10 personnes.</p>
              <ul className="space-y-2">
                {boat.specs.map((spec, i) => (
                  <li key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <input aria-label="Caractéristique" value={spec.label} placeholder="Caractéristique"
                      onChange={e => setBoat(boat.id, b => ({ ...b, specs: b.specs.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) }))}
                      className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-marine-blue focus:ring-2 focus:ring-marine-blue/20 outline-none" />
                    <input aria-label="Valeur" value={spec.value} placeholder="Valeur"
                      onChange={e => setBoat(boat.id, b => ({ ...b, specs: b.specs.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)) }))}
                      className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 font-semibold focus:border-marine-blue focus:ring-2 focus:ring-marine-blue/20 outline-none" />
                    <ItemControls index={i} length={boat.specs.length}
                      onMove={d => setBoat(boat.id, b => ({ ...b, specs: move(b.specs, i, d) }))}
                      onRemove={() => setBoat(boat.id, b => ({ ...b, specs: b.specs.filter((_, j) => j !== i) }))} />
                  </li>
                ))}
              </ul>
              <Button size="sm" className="mt-3" onClick={() => setBoat(boat.id, b => ({ ...b, specs: [...b.specs, { label: '', value: '' }] }))}>
                <Plus size={16} aria-hidden="true" /> Ajouter une caractéristique
              </Button>
            </div>

            <StringList label="Options & prestations à bord" items={boat.options ?? []} addLabel="Ajouter une option"
              onChange={v => setBoat(boat.id, b => ({ ...b, options: v }))} />

            {draft.boats.length > 1 && (
              <div className="pt-4 border-t border-slate-100">
                <Button variant="danger" size="sm" onClick={() => { if (confirm(`Supprimer « ${boat.name} » ?`)) update(d => ({ ...d, boats: d.boats.filter(b => b.id !== boat.id) })); }}>
                  <Trash2 size={16} aria-hidden="true" /> Supprimer ce bateau
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tarifs, services & FAQ                                               */
/* ------------------------------------------------------------------ */

const ICON_OPTIONS = [
  { value: 'calendar', label: 'Calendrier' },
  { value: 'ship', label: 'Bateau' },
  { value: 'sparkles', label: 'Étoiles' },
  { value: 'sun', label: 'Soleil' },
  { value: 'map', label: 'Carte' },
  { value: 'clock', label: 'Horloge' },
];

export function PricingSection({ draft, update }: SectionProps) {
  const s = draft.settings;
  const setSettings = (patch: Partial<SiteSettings>) => update(d => ({ ...d, settings: { ...d.settings, ...patch } }));

  return (
    <>
      <SectionHeader title="Tarifs & prestations" description="Contenu de la page « Prestations » : tarifs saisonniers, cartes de services et questions fréquentes." />
      <div className="space-y-6">
        <Card title="Tarifs de location à la journée" description="Affichés sous les excursions qui ont l'option « grille des tarifs saisonniers ».">
          <ul className="space-y-2">
            {s.rates.map((rate, i) => (
              <li key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input aria-label="Période" value={rate.label} placeholder="Période (ex. Juillet)"
                  onChange={e => setSettings({ rates: s.rates.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)) })}
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-marine-blue focus:ring-2 focus:ring-marine-blue/20 outline-none" />
                <input aria-label="Prix" value={rate.price} placeholder="Prix (ex. 2200€)"
                  onChange={e => setSettings({ rates: s.rates.map((r, j) => (j === i ? { ...r, price: e.target.value } : r)) })}
                  className="sm:w-40 rounded-xl border border-slate-300 px-3.5 py-2.5 font-semibold focus:border-marine-blue focus:ring-2 focus:ring-marine-blue/20 outline-none" />
                <ItemControls index={i} length={s.rates.length} onMove={d => setSettings({ rates: move(s.rates, i, d) })}
                  onRemove={() => setSettings({ rates: s.rates.filter((_, j) => j !== i) })} />
              </li>
            ))}
          </ul>
          <Button size="sm" onClick={() => setSettings({ rates: [...s.rates, { label: '', price: '' }] })}><Plus size={16} aria-hidden="true" /> Ajouter une période</Button>
          <TextInput label="Note sous les tarifs" value={s.ratesNote} onChange={v => setSettings({ ratesNote: v })} />
        </Card>

        <Card title="Cartes de services" description="Les 4 encadrés en haut de la page Prestations.">
          <ul className="space-y-5">
            {s.services.map((service, i) => {
              const setService = (patch: Partial<typeof service>) => setSettings({ services: s.services.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <li key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-800">Service {i + 1}</p>
                    <ItemControls index={i} length={s.services.length} onMove={d => setSettings({ services: move(s.services, i, d) })}
                      onRemove={() => { if (confirm(`Supprimer « ${service.title} » ?`)) setSettings({ services: s.services.filter((_, j) => j !== i) }); }} />
                  </div>
                  <div className="grid sm:grid-cols-[1fr_200px] gap-4">
                    <TextInput label="Titre" value={service.title} onChange={v => setService({ title: v })} />
                    <Select label="Icône" value={service.icon} onChange={v => setService({ icon: v })} options={ICON_OPTIONS} />
                  </div>
                  <TextArea label="Description" rows={3} value={service.description} onChange={v => setService({ description: v })} />
                  <StringList label="Points clés" items={service.details} onChange={v => setService({ details: v })} addLabel="Ajouter un point" />
                </li>
              );
            })}
          </ul>
          <Button size="sm" onClick={() => setSettings({ services: [...s.services, { title: 'Nouveau service', icon: 'sparkles', description: '', details: [] }] })}>
            <Plus size={16} aria-hidden="true" /> Ajouter un service
          </Button>
        </Card>

        <Card title="Questions fréquentes" description="Affichées en bas de la page Prestations. Très utiles pour Google : répondez aux questions que vos clients posent souvent.">
          <ul className="space-y-4">
            {s.faq.map((item, i) => (
              <li key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-800">Question {i + 1}</p>
                  <ItemControls index={i} length={s.faq.length} onMove={d => setSettings({ faq: move(s.faq, i, d) })}
                    onRemove={() => setSettings({ faq: s.faq.filter((_, j) => j !== i) })} />
                </div>
                <TextInput label="Question" value={item.q} onChange={v => setSettings({ faq: s.faq.map((f, j) => (j === i ? { ...f, q: v } : f)) })} />
                <TextArea label="Réponse" rows={3} value={item.a} onChange={v => setSettings({ faq: s.faq.map((f, j) => (j === i ? { ...f, a: v } : f)) })} />
              </li>
            ))}
          </ul>
          <Button size="sm" onClick={() => setSettings({ faq: [...s.faq, { q: '', a: '' }] })}><Plus size={16} aria-hidden="true" /> Ajouter une question</Button>
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Qui sommes-nous                                                      */
/* ------------------------------------------------------------------ */

export function AboutSection({ draft, update }: SectionProps) {
  const a = draft.settings.about;
  const set = (patch: Partial<typeof a>) => update(d => ({ ...d, settings: { ...d.settings, about: { ...d.settings.about, ...patch } } }));
  return (
    <>
      <SectionHeader title="Qui sommes-nous" description="La présentation du capitaine et de l'entreprise." />
      <div className="space-y-6">
        <Card title="Présentation">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Début du titre" value={a.title} onChange={v => set({ title: v })} />
            <TextInput label="Prénom mis en avant" value={a.highlight} onChange={v => set({ highlight: v })} />
          </div>
          <ImageField label="Photo" value={a.photo} onChange={v => set({ photo: v })} hint="Format portrait de préférence." />
          <TextInput label="Titre du 1er paragraphe" value={a.personalTitle} onChange={v => set({ personalTitle: v })} />
          <TextArea label="1er paragraphe" rows={5} value={a.personalText} onChange={v => set({ personalText: v })} />
          <TextInput label="Titre du 2e paragraphe" value={a.careerTitle} onChange={v => set({ careerTitle: v })} />
          <TextArea label="2e paragraphe" rows={5} value={a.careerText} onChange={v => set({ careerText: v })} />
        </Card>
        <Card title="Citation">
          <TextArea label="Citation" rows={3} value={a.quote} onChange={v => set({ quote: v })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Signature" value={a.signature} onChange={v => set({ signature: v })} />
            <TextInput label="Fonction" value={a.signatureRole} onChange={v => set({ signatureRole: v })} />
          </div>
        </Card>
        <Card title="Chiffres clés" description="Les 4 encadrés sous la présentation.">
          <ul className="space-y-3">
            {a.stats.map((stat, i) => (
              <li key={i} className="grid sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 items-end">
                <TextInput label="Valeur" value={stat.value} onChange={v => set({ stats: a.stats.map((s, j) => (j === i ? { ...s, value: v } : s)) })} />
                <TextInput label="Titre" value={stat.label} onChange={v => set({ stats: a.stats.map((s, j) => (j === i ? { ...s, label: v } : s)) })} />
                <TextInput label="Détail" value={stat.desc} onChange={v => set({ stats: a.stats.map((s, j) => (j === i ? { ...s, desc: v } : s)) })} />
                <ItemControls index={i} length={a.stats.length} onMove={d => set({ stats: move(a.stats, i, d) })} onRemove={() => set({ stats: a.stats.filter((_, j) => j !== i) })} />
              </li>
            ))}
          </ul>
          {a.stats.length < 4 && (
            <Button size="sm" onClick={() => set({ stats: [...a.stats, { value: '', label: '', desc: '' }] })}><Plus size={16} aria-hidden="true" /> Ajouter un chiffre</Button>
          )}
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Coordonnées                                                          */
/* ------------------------------------------------------------------ */

export function ContactSection({ draft, update }: SectionProps) {
  const c = draft.settings.contact;
  const set = (patch: Partial<typeof c>) => update(d => ({ ...d, settings: { ...d.settings, contact: { ...d.settings.contact, ...patch } } }));
  return (
    <>
      <SectionHeader title="Coordonnées" description="Utilisées partout sur le site (pied de page, page Contact, menu mobile) et transmises à Google. Gardez-les identiques à votre fiche Google." />
      <div className="space-y-6">
        <Card title="Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Téléphone" type="tel" value={c.phone} onChange={v => set({ phone: v })} placeholder="06 11 81 84 86" />
            <TextInput label="E-mail" type="email" value={c.email} onChange={v => set({ email: v })} />
          </div>
        </Card>
        <Card title="Adresse d'embarquement">
          <TextInput label="Adresse" value={c.address} onChange={v => set({ address: v })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Code postal" value={c.postalCode} onChange={v => set({ postalCode: v })} />
            <TextInput label="Ville" value={c.city} onChange={v => set({ city: v })} />
          </div>
        </Card>
        <Card title="Horaires">
          <TextInput label="Horaires" value={c.hours} onChange={v => set({ hours: v })} placeholder="Tous les jours : 09:00 – 20:00" />
          <TextInput label="Précision (saison…)" value={c.seasonNote} onChange={v => set({ seasonNote: v })} hint="Laissez vide pour ne rien afficher." />
        </Card>
        <Card title="Liens">
          <TextInput label="Instagram" type="url" value={c.instagram} onChange={v => set({ instagram: v })} />
          <TextInput label="Fiche Google (lien Google Maps)" type="url" value={c.googleProfile} onChange={v => set({ googleProfile: v })} hint="Utilisé pour les boutons « Avis Google »." />
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Référencement                                                        */
/* ------------------------------------------------------------------ */

const PAGE_LABELS: Record<string, string> = {
  '/': 'Accueil',
  '/qui-sommes-nous': 'Qui sommes-nous',
  '/nos-bateaux': 'Nos bateaux',
  '/nos-prestations': 'Prestations',
  '/contact': 'Contact',
};

export function SeoSection({ draft, update }: SectionProps) {
  const seo = draft.settings.seo;
  const set = (path: string, patch: { title?: string; description?: string }) =>
    update(d => ({ ...d, settings: { ...d.settings, seo: { ...d.settings.seo, [path]: { ...d.settings.seo[path], ...patch } } } }));

  return (
    <>
      <SectionHeader title="Référencement Google" description="Le titre et la description qui apparaissent dans les résultats Google. Laissez un champ vide pour garder le texte optimisé par défaut." />
      <div className="space-y-6">
        {Object.entries(PAGE_LABELS).map(([path, label]) => {
          const base = PAGES[path];
          const title = seo[path]?.title || '';
          const description = seo[path]?.description || '';
          return (
            <Card key={path} title={label}>
              <div className="rounded-xl border border-slate-200 p-4 bg-white" aria-label="Aperçu dans Google">
                <p className="text-xs text-slate-500 mb-1">Aperçu Google · {path}</p>
                <p className="text-[#1a0dab] text-lg leading-snug truncate">{title || base.title}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{description || base.description}</p>
              </div>
              <TextInput label="Titre" value={title} placeholder={base.title} onChange={v => set(path, { title: v })}
                hint={`${(title || base.title).length} caractères — idéalement entre 50 et 60.`} />
              <TextArea label="Description" rows={3} value={description} placeholder={base.description} onChange={v => set(path, { description: v })}
                counter={160} hint="Idéalement entre 120 et 160 caractères." />
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Mentions légales                                                     */
/* ------------------------------------------------------------------ */

export function LegalSection({ draft, update }: SectionProps) {
  const l = draft.settings.legal;
  const set = (patch: Partial<typeof l>) => update(d => ({ ...d, settings: { ...d.settings, legal: { ...d.settings.legal, ...patch } } }));
  return (
    <>
      <SectionHeader title="Mentions légales" description="Informations obligatoires pour un site professionnel en France (page « Mentions légales »)." />
      <Card>
        <TextInput label="Forme juridique" value={l.legalForm} onChange={v => set({ legalForm: v })} placeholder="EI, SARL, SAS…" />
        <TextInput label="Numéro SIRET" value={l.siret} onChange={v => set({ siret: v })} />
        <TextInput label="Directeur de la publication" value={l.director} onChange={v => set({ director: v })} placeholder="Prénom Nom" />
        <TextArea label="Hébergeur du site" rows={3} value={l.host} onChange={v => set({ host: v })} hint="Nom, adresse et téléphone de l'hébergeur." />
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Médiathèque                                                          */
/* ------------------------------------------------------------------ */

export function MediaSection({ uploaded, usedImages, onRefresh }: { uploaded: string[]; usedImages: Set<string>; onRefresh: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <>
      <SectionHeader title="Photos" description="Vos photos téléversées. Elles sont automatiquement redimensionnées et compressées pour un site rapide."
        action={<UploadButton multiple label="Téléverser des photos" onUploaded={onRefresh} />} />
      {uploaded.length === 0 ? (
        <Card><p className="text-slate-500">Aucune photo téléversée pour l'instant.</p></Card>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploaded.map(url => {
            const used = usedImages.has(url);
            return (
              <li key={url} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <Thumb src={url} className="w-full aspect-[4/3]" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${used ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {used ? 'Utilisée' : 'Non utilisée'}
                  </span>
                  <Button size="sm" variant="ghost" title={used ? 'Photo utilisée sur le site : retirez-la d\'abord' : 'Supprimer la photo'}
                    disabled={used || busy === url} className="!text-red-600 hover:!bg-red-50"
                    onClick={async () => {
                      if (!confirm('Supprimer définitivement cette photo ?')) return;
                      setBusy(url);
                      try { await deleteImage(url); onRefresh(); } catch { alert('Suppression impossible'); } finally { setBusy(null); }
                    }}>
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
