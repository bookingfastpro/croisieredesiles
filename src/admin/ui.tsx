import React, { createContext, useContext, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUp, Check, Image as ImageIcon, Link2, Loader2, Plus, Trash2, Upload, X,
} from 'lucide-react';
import { uploadImage } from '../services/api';
import { optimized } from '../utils/img';

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">{title}</h2>
        {description && <p className="text-slate-600 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, description, children, className = '' }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
      {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      <div className={title || description ? 'mt-5 space-y-5' : 'space-y-5'}>{children}</div>
    </section>
  );
}

let fieldId = 0;
const useFieldId = () => useRef(`admin-field-${++fieldId}`).current;

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: React.ReactNode; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-800 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-marine-blue focus:ring-2 focus:ring-marine-blue/20 outline-none transition disabled:bg-slate-100 disabled:text-slate-400';

export function TextInput({ label, hint, value, onChange, placeholder, type = 'text', maxLength, disabled }: {
  label: string; hint?: React.ReactNode; value: string | number | undefined; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number; disabled?: boolean;
}) {
  const id = useFieldId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input id={id} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} disabled={disabled} className={inputClass} />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 4, placeholder, counter }: {
  label: string; hint?: React.ReactNode; value: string | undefined; onChange: (v: string) => void; rows?: number; placeholder?: string;
  /** Show a character counter with this recommended maximum */
  counter?: number;
}) {
  const id = useFieldId();
  const len = (value || '').length;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={
        counter ? (
          <span className="flex justify-between gap-4">
            <span>{hint}</span>
            <span className={len > counter ? 'text-amber-600 font-semibold' : ''}>{len} / {counter}</span>
          </span>
        ) : hint
      }
    >
      <textarea id={id} rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} resize-y leading-relaxed`} />
    </Field>
  );
}

export function Select({ label, hint, value, onChange, options }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  const id = useFieldId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="mt-0.5 relative w-11 h-6 shrink-0 rounded-full bg-slate-300 peer-checked:bg-marine-blue transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-marine-blue peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {hint && <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export function Button({ children, onClick, variant = 'secondary', size = 'md', type = 'button', disabled, title, className = '' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; type?: 'button' | 'submit'; disabled?: boolean; title?: string; className?: string;
}) {
  const variants = {
    primary: 'bg-marine-blue text-white hover:bg-marine-navy shadow-sm',
    secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50',
    danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-4 py-2.5 text-sm gap-2' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} aria-label={title}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lists                                                                */
/* ------------------------------------------------------------------ */

export function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export function ItemControls({ index, length, onMove, onRemove, removeLabel = 'Supprimer' }: {
  index: number; length: number; onMove: (delta: number) => void; onRemove: () => void; removeLabel?: string;
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Button size="sm" variant="ghost" title="Monter" onClick={() => onMove(-1)} disabled={index === 0}><ArrowUp size={16} aria-hidden="true" /></Button>
      <Button size="sm" variant="ghost" title="Descendre" onClick={() => onMove(1)} disabled={index === length - 1}><ArrowDown size={16} aria-hidden="true" /></Button>
      <Button size="sm" variant="ghost" title={removeLabel} onClick={onRemove} className="!text-red-600 hover:!bg-red-50"><Trash2 size={16} aria-hidden="true" /></Button>
    </div>
  );
}

/** Editable list of short texts (étapes, lieux, infos pratiques…). */
export function StringList({ label, hint, items, onChange, addLabel = 'Ajouter une ligne', multiline = false, placeholder }: {
  label: string; hint?: string; items: string[]; onChange: (items: string[]) => void; addLabel?: string; multiline?: boolean; placeholder?: string;
}) {
  const update = (i: number, v: string) => onChange(items.map((it, j) => (j === i ? v : it)));
  return (
    <div>
      <p className="block text-sm font-semibold text-slate-800 mb-1">{label}</p>
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-2.5 w-6 text-right text-xs font-bold text-slate-400 shrink-0">{i + 1}.</span>
            {multiline ? (
              <textarea aria-label={`${label} – ligne ${i + 1}`} rows={2} value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} className={`${inputClass} resize-y`} />
            ) : (
              <input aria-label={`${label} – ligne ${i + 1}`} value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder} className={inputClass} />
            )}
            <ItemControls index={i} length={items.length} onMove={d => onChange(move(items, i, d))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ol>
      <Button size="sm" className="mt-3" onClick={() => onChange([...items, ''])}><Plus size={16} aria-hidden="true" /> {addLabel}</Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Images                                                               */
/* ------------------------------------------------------------------ */

interface MediaCtx {
  /** Opens the photo library; resolves with the chosen URLs (empty if cancelled). */
  pick: (opts?: { multiple?: boolean }) => Promise<string[]>;
}
export const MediaContext = createContext<MediaCtx>({ pick: async () => [] });
export const useMedia = () => useContext(MediaContext);

export function useUploader(onUploaded: (urls: string[]) => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const upload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) urls.push(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
      if (urls.length) onUploaded(urls);
    }
  };
  return { busy, error, upload };
}

export function UploadButton({ onUploaded, multiple = false, label = 'Téléverser depuis mon appareil' }: { onUploaded: (urls: string[]) => void; multiple?: boolean; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUploader(onUploaded);
  return (
    <span className="inline-flex flex-col">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} className="sr-only" tabIndex={-1}
        onChange={e => { upload(e.target.files); e.target.value = ''; }} />
      <Button size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
        {busy ? 'Envoi en cours…' : label}
      </Button>
      {error && <span role="alert" className="text-xs text-red-600 mt-1">{error}</span>}
    </span>
  );
}

export function Thumb({ src, alt = '', className = '' }: { src?: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <ImageIcon size={22} aria-hidden="true" />
      </div>
    );
  }
  return <img src={optimized(src, 480)} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} className={`object-cover bg-slate-100 ${className}`} />;
}

/** Single image: preview + library + upload + manual URL. */
export function ImageField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const { pick } = useMedia();
  const [showUrl, setShowUrl] = useState(false);
  const id = useFieldId();
  return (
    <Field label={label} hint={hint} htmlFor={showUrl ? id : undefined}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Thumb src={value} className="w-full sm:w-48 aspect-video rounded-xl border border-slate-200" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={async () => { const [url] = await pick(); if (url) onChange(url); }}>
            <ImageIcon size={16} aria-hidden="true" /> Choisir une photo
          </Button>
          <UploadButton onUploaded={urls => onChange(urls[0])} />
          <Button size="sm" variant="ghost" onClick={() => setShowUrl(v => !v)}><Link2 size={16} aria-hidden="true" /> Lien</Button>
        </div>
      </div>
      {showUrl && <input id={id} value={value} onChange={e => onChange(e.target.value)} placeholder="https://…" className={`${inputClass} mt-3 text-sm`} />}
    </Field>
  );
}

/** Ordered list of images (galleries). */
export function GalleryField({ label, hint, images, onChange }: { label: string; hint?: string; images: string[]; onChange: (v: string[]) => void }) {
  const { pick } = useMedia();
  return (
    <div>
      <p className="block text-sm font-semibold text-slate-800 mb-1">{label}</p>
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      {images.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-4">Aucune photo pour l'instant.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <li key={`${img}-${i}`} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white">
              <Thumb src={img} className="w-full aspect-[4/3]" />
              {i === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-marine-blue text-white text-[11px] font-bold">Principale</span>}
              <div className="flex justify-center bg-white border-t border-slate-100">
                <ItemControls index={i} length={images.length} onMove={d => onChange(move(images, i, d))} onRemove={() => onChange(images.filter((_, j) => j !== i))} removeLabel="Retirer cette photo" />
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        <Button size="sm" onClick={async () => { const urls = await pick({ multiple: true }); if (urls.length) onChange([...images, ...urls]); }}>
          <Plus size={16} aria-hidden="true" /> Ajouter depuis la médiathèque
        </Button>
        <UploadButton multiple label="Téléverser des photos" onUploaded={urls => onChange([...images, ...urls])} />
      </div>
    </div>
  );
}

/** Photo library modal. */
export function MediaPicker({ images, multiple, onCancel, onConfirm, onUploaded }: {
  images: string[]; multiple: boolean; onCancel: () => void; onConfirm: (urls: string[]) => void; onUploaded: (urls: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (url: string) => {
    if (!multiple) return onConfirm([url]);
    setSelected(s => (s.includes(url) ? s.filter(u => u !== url) : [...s, url]));
  };
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 md:p-8" role="dialog" aria-modal="true" aria-label="Médiathèque">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onCancel} />
      <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl bg-white md:rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Choisir {multiple ? 'des photos' : 'une photo'}</h3>
            <p className="text-sm text-slate-500">{multiple ? 'Cliquez sur les photos à ajouter, puis validez.' : 'Cliquez sur une photo pour la sélectionner.'}</p>
          </div>
          <Button variant="ghost" title="Fermer" onClick={onCancel}><X size={20} aria-hidden="true" /></Button>
        </div>
        <div className="p-5 border-b border-slate-100">
          <UploadButton multiple onUploaded={onUploaded} label="Téléverser de nouvelles photos" />
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {images.length === 0 ? (
            <p className="text-center text-slate-500 py-12">Aucune photo. Téléversez vos premières photos ci-dessus.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map(url => {
                const isSel = selected.includes(url);
                return (
                  <li key={url}>
                    <button type="button" onClick={() => toggle(url)} aria-pressed={multiple ? isSel : undefined}
                      className={`relative block w-full rounded-xl overflow-hidden border-2 transition ${isSel ? 'border-marine-blue ring-2 ring-marine-blue/30' : 'border-transparent hover:border-slate-300'}`}>
                      <Thumb src={url} className="w-full aspect-[4/3]" />
                      {isSel && (
                        <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-marine-blue text-white flex items-center justify-center">
                          <Check size={16} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {multiple && (
          <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
            <Button onClick={onCancel}>Annuler</Button>
            <Button variant="primary" disabled={selected.length === 0} onClick={() => onConfirm(selected)}>
              Ajouter {selected.length > 0 ? `${selected.length} photo${selected.length > 1 ? 's' : ''}` : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
