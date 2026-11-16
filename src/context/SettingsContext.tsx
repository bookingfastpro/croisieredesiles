import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS, mergeSettings } from '../data/defaultSettings';
import { fetchFreshSettings } from '../services/api';

interface Ctx {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
}

const SettingsContext = createContext<Ctx>({ settings: DEFAULT_SETTINGS, setSettings: () => {} });

function readCache(): SiteSettings {
  try {
    const stored = localStorage.getItem('cache_settings');
    return stored ? mergeSettings(JSON.parse(stored)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(readCache);

  useEffect(() => {
    fetchFreshSettings().then(fresh => fresh && setSettings(fresh));
  }, []);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
