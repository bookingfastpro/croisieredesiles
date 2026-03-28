import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Plus, Trash2, Edit3, Image as ImageIcon, Layout, Ship, Map } from 'lucide-react';
import { Circuit, HeroData, Boat } from '../types';
import { getCircuits, saveCircuits, getImages, getHero, saveHero, getBoats, saveBoats } from '../services/api';

interface Props {
  onClose: () => void;
  onUpdate: () => void;
}

type Tab = 'circuits' | 'hero' | 'boats';

export default function AdminPanel({ onClose, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('circuits');
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState<{ id: string, type: 'circuit' | 'hero' | 'boat', boatIndex?: number } | null>(null);

  useEffect(() => {
    fetchData();
    fetchImages();
  }, []);

  const fetchData = async () => {
    const [circuitsData, hero, boatsData] = await Promise.all([
      getCircuits(),
      getHero(),
      getBoats()
    ]);
    setCircuits(circuitsData);
    setHeroData(hero);
    setBoats(boatsData);
  };

  const fetchImages = async () => {
    const images = await getImages();
    setAvailableImages(images);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveCircuits(circuits),
        heroData ? saveHero(heroData) : Promise.resolve(),
        saveBoats(boats)
      ]);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const updateCircuit = (id: string, field: keyof Circuit, value: any) => {
    setCircuits(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateHero = (field: keyof HeroData, value: string) => {
    if (heroData) {
      setHeroData({ ...heroData, [field]: value });
    }
  };

  const updateBoat = (id: string, field: keyof Boat, value: any) => {
    setBoats(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const updateBoatSpec = (boatId: string, specIndex: number, field: 'label' | 'value', value: string) => {
    setBoats(prev => prev.map(b => {
      if (b.id === boatId) {
        const newSpecs = [...b.specs];
        newSpecs[specIndex] = { ...newSpecs[specIndex], [field]: value };
        return { ...b, specs: newSpecs };
      }
      return b;
    }));
  };

  const addBoatSpec = (boatId: string) => {
    setBoats(prev => prev.map(b => {
      if (b.id === boatId) {
        return { ...b, specs: [...b.specs, { label: "Nouveau", value: "Valeur" }] };
      }
      return b;
    }));
  };

  const removeBoatSpec = (boatId: string, specIndex: number) => {
    setBoats(prev => prev.map(b => {
      if (b.id === boatId) {
        return { ...b, specs: b.specs.filter((_, i) => i !== specIndex) };
      }
      return b;
    }));
  };

  const addCircuit = () => {
    const newCircuit: Circuit = {
      id: Date.now().toString(),
      name: "Nouveau Circuit",
      duration: "2h",
      price: 0,
      description: "Description courte",
      longDescription: "Description longue détaillée",
      image: "https://picsum.photos/seed/new/800/600",
      itinerary: ["Point de départ"],
      locations: ["Point de départ"],
      practicalInfos: ["Info pratique"],
      coordinates: [{ lat: 43.2965, lng: 5.3698 }]
    };
    setCircuits([...circuits, newCircuit]);
    setEditingId(newCircuit.id);
  };

  const addBoat = () => {
    const newBoat: Boat = {
      id: Date.now().toString(),
      name: "Nouveau Bateau",
      description: "Description du bateau",
      image: "https://picsum.photos/seed/boat/800/600",
      specs: [
        { label: "Capacité", value: "12 personnes" }
      ]
    };
    setBoats([...boats, newBoat]);
    setEditingId(newBoat.id);
  };

  const deleteCircuit = (id: string) => {
    if (confirm("Supprimer ce circuit ?")) {
      setCircuits(prev => prev.filter(c => c.id !== id));
    }
  };

  const deleteBoat = (id: string) => {
    if (confirm("Supprimer ce bateau ?")) {
      setBoats(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleImageSelect = (img: string) => {
    if (!showImagePicker) return;

    if (showImagePicker.type === 'circuit') {
      updateCircuit(showImagePicker.id, 'image', img);
    } else if (showImagePicker.type === 'hero') {
      updateHero('image', img);
    } else if (showImagePicker.type === 'boat') {
      updateBoat(showImagePicker.id, 'image', img);
    }
    setShowImagePicker(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-10"
    >
      <div className="absolute inset-0 bg-marine-deep/90 backdrop-blur-xl hidden md:block" onClick={onClose}></div>
      
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full h-full md:max-w-6xl md:max-h-[90vh] glass-blue md:rounded-[2.5rem] rounded-none border border-white/20 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-4 md:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Panel Administrateur</h2>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('circuits')}
                className={`text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'circuits' ? 'text-marine-turquoise font-bold' : 'text-white/50 hover:text-white'}`}
              >
                <Map size={14} /> Circuits
              </button>
              <button 
                onClick={() => setActiveTab('hero')}
                className={`text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'hero' ? 'text-marine-turquoise font-bold' : 'text-white/50 hover:text-white'}`}
              >
                <Layout size={14} /> Hero
              </button>
              <button 
                onClick={() => setActiveTab('boats')}
                className={`text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'boats' ? 'text-marine-turquoise font-bold' : 'text-white/50 hover:text-white'}`}
              >
                <Ship size={14} /> Bateaux
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full sm:w-auto">
            {(activeTab === 'circuits' || activeTab === 'boats') && (
              <button 
                onClick={activeTab === 'circuits' ? addCircuit : addBoat}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-marine-turquoise/20 hover:bg-marine-turquoise/40 text-marine-turquoise rounded-full font-bold flex items-center justify-center gap-2 transition-all border border-marine-turquoise/30 text-sm"
              >
                <Plus size={16} /> Ajouter
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 md:px-8 py-2 bg-marine-light hover:bg-marine-turquoise text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all glow-blue disabled:opacity-50 text-sm"
            >
              <Save size={16} /> {isSaving ? '...' : 'Enregistrer'}
            </button>
            <button onClick={onClose} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === 'circuits' && (
            <div className="grid gap-6">
              {circuits.map(circuit => (
                <div key={circuit.id} className="glass p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="relative group">
                        <img src={circuit.image} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                        <button 
                          onClick={() => setShowImagePicker({ id: circuit.id, type: 'circuit' })}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl"
                        >
                          <ImageIcon size={20} className="text-white" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{circuit.name}</h3>
                        <p className="text-marine-turquoise text-sm font-bold">{circuit.price}€ • {circuit.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingId(editingId === circuit.id ? null : circuit.id)}
                        className="p-3 glass rounded-xl hover:bg-marine-light/20 text-white transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteCircuit(circuit.id)}
                        className="p-3 glass rounded-xl hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {editingId === circuit.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Nom du circuit</label>
                          <input 
                            value={circuit.name}
                            onChange={e => updateCircuit(circuit.id, 'name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Durée</label>
                            <input 
                              value={circuit.duration}
                              onChange={e => updateCircuit(circuit.id, 'duration', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Prix (€)</label>
                            <input 
                              type="number"
                              value={circuit.price}
                              onChange={e => updateCircuit(circuit.id, 'price', Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">URL Image ou Sélection</label>
                          <div className="flex gap-2">
                            <input 
                              value={circuit.image}
                              onChange={e => updateCircuit(circuit.id, 'image', e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                            />
                            <button 
                              onClick={() => setShowImagePicker({ id: circuit.id, type: 'circuit' })}
                              className="p-2 glass rounded-xl hover:bg-white/10 text-white"
                            >
                              <ImageIcon size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Description courte</label>
                          <textarea 
                            value={circuit.description}
                            onChange={e => updateCircuit(circuit.id, 'description', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none h-20 resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Description longue</label>
                          <textarea 
                            value={circuit.longDescription}
                            onChange={e => updateCircuit(circuit.id, 'longDescription', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none h-32 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'hero' && heroData && (
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex gap-6 items-start">
                <div className="relative group w-48 aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <img src={heroData.image} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setShowImagePicker({ id: 'hero', type: 'hero' })}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <ImageIcon size={24} className="text-white" />
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Titre (utilisez \n pour un saut de ligne)</label>
                    <textarea 
                      value={heroData.title}
                      onChange={e => updateHero('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Sous-titre</label>
                    <textarea 
                      value={heroData.subtitle}
                      onChange={e => updateHero('subtitle', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">URL Image Hero</label>
                    <div className="flex gap-2">
                      <input 
                        value={heroData.image}
                        onChange={e => updateHero('image', e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                      />
                      <button 
                        onClick={() => setShowImagePicker({ id: 'hero', type: 'hero' })}
                        className="p-2 glass rounded-xl hover:bg-white/10 text-white"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'boats' && (
            <div className="grid gap-6">
              {boats.map(boat => (
                <div key={boat.id} className="glass p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="relative group">
                        <img src={boat.image} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                        <button 
                          onClick={() => setShowImagePicker({ id: boat.id, type: 'boat' })}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl"
                        >
                          <ImageIcon size={20} className="text-white" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{boat.name}</h3>
                        <p className="text-white/50 text-sm">{boat.specs.length} spécifications</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingId(editingId === boat.id ? null : boat.id)}
                        className="p-3 glass rounded-xl hover:bg-marine-light/20 text-white transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteBoat(boat.id)}
                        className="p-3 glass rounded-xl hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {editingId === boat.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-6 pt-6 border-t border-white/10"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Nom du bateau</label>
                            <input 
                              value={boat.name}
                              onChange={e => updateBoat(boat.id, 'name', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Description</label>
                            <textarea 
                              value={boat.description}
                              onChange={e => updateBoat(boat.id, 'description', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none h-32 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">URL Image</label>
                            <div className="flex gap-2">
                              <input 
                                value={boat.image}
                                onChange={e => updateBoat(boat.id, 'image', e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-marine-turquoise outline-none"
                              />
                              <button 
                                onClick={() => setShowImagePicker({ id: boat.id, type: 'boat' })}
                                className="p-2 glass rounded-xl hover:bg-white/10 text-white"
                              >
                                <ImageIcon size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block">Spécifications</label>
                            <button 
                              onClick={() => addBoatSpec(boat.id)}
                              className="text-xs text-marine-turquoise hover:underline flex items-center gap-1"
                            >
                              <Plus size={12} /> Ajouter
                            </button>
                          </div>
                          <div className="space-y-3">
                            {boat.specs.map((spec, sIdx) => (
                              <div key={sIdx} className="flex gap-2 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <input 
                                  value={spec.label}
                                  onChange={e => updateBoatSpec(boat.id, sIdx, 'label', e.target.value)}
                                  placeholder="Label"
                                  className="flex-1 bg-transparent border-none text-white text-sm outline-none"
                                />
                                <input 
                                  value={spec.value}
                                  onChange={e => updateBoatSpec(boat.id, sIdx, 'value', e.target.value)}
                                  placeholder="Valeur"
                                  className="flex-1 bg-transparent border-none text-marine-turquoise text-sm font-bold outline-none"
                                />
                                <button 
                                  onClick={() => removeBoatSpec(boat.id, sIdx)}
                                  className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md hidden md:block" onClick={() => setShowImagePicker(null)}></div>
          <div className="relative w-full h-full md:max-w-2xl md:max-h-[80vh] bg-marine-deep border border-white/10 md:rounded-[2rem] rounded-none p-6 md:p-8 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Choisir une image</h3>
              <button onClick={() => setShowImagePicker(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 custom-scrollbar">
              {availableImages.length === 0 ? (
                <div className="col-span-3 py-12 text-center text-white/40">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Aucune image trouvée dans <code className="bg-white/5 px-2 py-1 rounded">public/images/circuits</code></p>
                  <p className="text-xs mt-2">Ajoutez vos photos dans ce dossier pour les voir ici.</p>
                </div>
              ) : (
                availableImages.map(img => (
                  <button 
                    key={img}
                    onClick={() => handleImageSelect(img)}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-marine-turquoise transition-all group"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-marine-turquoise/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
