import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle, CheckCircle2, ExternalLink, FileText, Home, Image as ImageIcon, Loader2, LogOut, Map, Phone, Save,
  Search, Ship, Tag, Undo2, User,
} from 'lucide-react';
import { getImages, saveBoats, saveCircuits, saveHero, saveSettings } from '../services/api';
import { mergeSettings } from '../data/defaultSettings';
import { useSettings } from '../context/SettingsContext';
import { Button, MediaContext, MediaPicker } from '../admin/ui';
import {
  AboutSection, BoatsSection, CircuitsSection, ContactSection, Draft, HomeSection, LegalSection, MediaSection,
  PricingSection, SeoSection,
} from '../admin/sections';

interface Props {
  onClose: () => void;
  onUpdate: () => void;
  onLogout?: () => void;
}

const SECTIONS = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'circuits', label: 'Excursions & croisières', icon: Map },
  { id: 'boats', label: 'Bateau', icon: Ship },
  { id: 'pricing', label: 'Tarifs & prestations', icon: Tag },
  { id: 'about', label: 'Qui sommes-nous', icon: User },
  { id: 'contact', label: 'Coordonnées', icon: Phone },
  { id: 'seo', label: 'Référencement Google', icon: Search },
  { id: 'legal', label: 'Mentions légales', icon: FileText },
  { id: 'media', label: 'Photos', icon: ImageIcon },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

async function loadDraft(): Promise<Draft> {
  const get = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());
  const [circuits, hero, boats, settings] = await Promise.all([get('/api/circuits'), get('/api/hero'), get('/api/boats'), get('/api/settings')]);
  return { circuits, hero, boats, settings: mergeSettings(settings) };
}

/** Collect every image URL referenced in the content (to offer them in the library). */
function collectImages(d: Draft): string[] {
  const urls = new Set<string>();
  const add = (u?: string) => u && urls.add(u);
  add(d.hero.image);
  add(d.settings.about.photo);
  d.circuits.forEach(c => { add(c.image); c.boatImages?.prestige?.forEach(add); });
  d.boats.forEach(b => { add(b.image); b.images?.forEach(add); });
  return [...urls];
}

export default function AdminPanel({ onClose, onUpdate, onLogout }: Props) {
  const { setSettings } = useSettings();
  const [section, setSection] = useState<SectionId>('home');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState<Draft | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [picker, setPicker] = useState<{ multiple: boolean; resolve: (urls: string[]) => void } | null>(null);
  const hasSavedOnce = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const refreshImages = useCallback(() => { getImages().then(setUploaded); }, []);

  useEffect(() => {
    loadDraft()
      .then(d => { setDraft(d); setSaved(structuredClone(d)); })
      .catch(() => setLoadError('Impossible de charger le contenu du site. Vérifiez votre connexion.'));
    refreshImages();
  }, [refreshImages]);

  const dirty = useMemo(() => {
    if (!draft || !saved) return { any: false, circuits: false, hero: false, boats: false, settings: false };
    const diff = (k: keyof Draft) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k]);
    const parts = { circuits: diff('circuits'), hero: diff('hero'), boats: diff('boats'), settings: diff('settings') };
    return { any: Object.values(parts).some(Boolean), ...parts };
  }, [draft, saved]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 4000);
  };

  const handleSave = useCallback(async () => {
    if (!draft || !dirty.any || isSaving) return;
    setIsSaving(true);
    try {
      await Promise.all([
        dirty.circuits ? saveCircuits(draft.circuits) : null,
        dirty.hero ? saveHero(draft.hero) : null,
        dirty.boats ? saveBoats(draft.boats) : null,
        dirty.settings ? saveSettings(draft.settings) : null,
      ]);
      setSaved(structuredClone(draft));
      if (dirty.settings) setSettings(draft.settings);
      hasSavedOnce.current = true;
      onUpdate();
      showToast('success', 'Modifications enregistrées et publiées sur le site.');
    } catch (error) {
      const expired = error instanceof Error && error.message === 'Unauthorized';
      showToast('error', expired ? 'Votre session a expiré : reconnectez-vous (vos modifications sont conservées tant que vous ne fermez pas).' : "Erreur lors de l'enregistrement. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  }, [draft, dirty, isSaving, onUpdate, setSettings]);

  const requestClose = useCallback(() => {
    if (dirty.any && !confirm('Vous avez des modifications non enregistrées. Quitter quand même ?')) return;
    if (hasSavedOnce.current) {
      // Reload so every page shows the freshly saved content
      window.location.reload();
      return;
    }
    onClose();
  }, [dirty.any, onClose]);

  // Keyboard shortcuts + warn before leaving with unsaved changes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); handleSave(); }
      if (e.key === 'Escape' && !picker) requestClose();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => { if (dirty.any) e.preventDefault(); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleSave, requestClose, dirty.any, picker]);

  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [section]);

  const update = useCallback((fn: (d: Draft) => Draft) => setDraft(d => (d ? fn(d) : d)), []);

  const libraryImages = useMemo(() => {
    const all = new Set<string>(uploaded);
    if (draft) collectImages(draft).forEach(u => all.add(u));
    return [...all];
  }, [uploaded, draft]);

  const usedImages = useMemo(() => new Set(draft ? collectImages(draft) : []), [draft]);

  const media = useMemo(() => ({
    pick: (opts?: { multiple?: boolean }) => new Promise<string[]>(resolve => setPicker({ multiple: !!opts?.multiple, resolve })),
  }), []);

  const closePicker = (urls: string[]) => { picker?.resolve(urls); setPicker(null); };

  const current = SECTIONS.find(s => s.id === section)!;

  return (
    <MediaContext.Provider value={media}>
      <div role="dialog" aria-modal="true" aria-label="Administration du site" className="fixed inset-0 z-[110] bg-slate-50 flex flex-col text-slate-800 font-sans">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
          <div className="min-w-0">
            <p className="hidden sm:block font-display font-bold text-lg text-slate-900 leading-tight">Administration</p>
            <p className={`text-xs flex items-center gap-1.5 ${dirty.any ? 'text-amber-700' : 'text-slate-500'}`} aria-live="polite">
              {dirty.any ? (
                <><span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" /> Modifications non enregistrées</>
              ) : (
                <><CheckCircle2 size={13} aria-hidden="true" className="text-emerald-600" /> Tout est enregistré</>
              )}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {dirty.any && (
              <Button variant="ghost" onClick={() => saved && confirm('Annuler toutes les modifications non enregistrées ?') && setDraft(structuredClone(saved))} title="Annuler les modifications">
                <Undo2 size={18} aria-hidden="true" /> <span className="hidden md:inline">Annuler</span>
              </Button>
            )}
            <Button variant="primary" onClick={handleSave} disabled={!dirty.any || isSaving}>
              {isSaving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
              {isSaving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
            <Button onClick={requestClose}>
              <ExternalLink size={18} aria-hidden="true" /> <span className="hidden sm:inline">Voir le site</span>
            </Button>
            {onLogout && (
              <Button variant="ghost" title="Se déconnecter" onClick={() => { if (!dirty.any || confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) onLogout(); }}>
                <LogOut size={18} aria-hidden="true" />
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Navigation */}
          <nav aria-label="Rubriques de l'administration" className="md:w-64 shrink-0 bg-white md:border-r border-b md:border-b-0 border-slate-200">
            <ul className="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <li key={id} className="shrink-0">
                  <button type="button" onClick={() => setSection(id)} aria-current={section === id ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                      section === id ? 'bg-marine-blue text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <Icon size={18} aria-hidden="true" /> {label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="hidden md:block px-5 py-4 text-xs text-slate-500 leading-relaxed">
              Astuce : <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-slate-50 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-slate-50 font-mono">S</kbd> pour enregistrer.
            </p>
          </nav>

          {/* Content */}
          <main ref={mainRef} className="flex-1 overflow-y-auto" aria-label={current.label}>
            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
              {loadError ? (
                <p role="alert" className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle size={18} aria-hidden="true" /> {loadError}
                </p>
              ) : !draft ? (
                <p className="flex items-center gap-2 text-slate-500 py-20 justify-center"><Loader2 className="animate-spin" aria-hidden="true" /> Chargement…</p>
              ) : (
                <>
                  {section === 'home' && <HomeSection draft={draft} update={update} />}
                  {section === 'circuits' && <CircuitsSection draft={draft} update={update} />}
                  {section === 'boats' && <BoatsSection draft={draft} update={update} />}
                  {section === 'pricing' && <PricingSection draft={draft} update={update} />}
                  {section === 'about' && <AboutSection draft={draft} update={update} />}
                  {section === 'contact' && <ContactSection draft={draft} update={update} />}
                  {section === 'seo' && <SeoSection draft={draft} update={update} />}
                  {section === 'legal' && <LegalSection draft={draft} update={update} />}
                  {section === 'media' && <MediaSection uploaded={uploaded} usedImages={usedImages} onRefresh={refreshImages} />}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Toast */}
        {toast && (
          <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[140] max-w-[90vw] flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
            {toast.text}
          </div>
        )}

        {picker && (
          <MediaPicker
            images={libraryImages}
            multiple={picker.multiple}
            onCancel={() => closePicker([])}
            onConfirm={closePicker}
            onUploaded={urls => { refreshImages(); if (!picker.multiple) closePicker(urls.slice(0, 1)); else setUploaded(u => [...urls, ...u]); }}
          />
        )}
      </div>
    </MediaContext.Provider>
  );
}
