'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKeys } from './translations';
import { applyDocumentDirection } from '@/lib/rtl';
import { clientLogger } from '@/lib/client-logger';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Helper to get current profile ID
const getCurrentProfileId = (): string | null => {
  try {
    const profileData = localStorage.getItem('gamestringer_current_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      return profile.id || null;
    }
  } catch (e: unknown) {
    clientLogger.warn('[I18N] Errore parsing profilo corrente:', e);
  }
  return null;
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount (per profile)
  useEffect(() => {
    setMounted(true);
    const loadLanguage = () => {
      try {
        const profileId = getCurrentProfileId();
        
        // Try profile-specific language first
        if (profileId) {
          const profileLang = localStorage.getItem(`gs_language_${profileId}`);
          if (profileLang && translations[profileLang as Language]) {
            setLanguageState(profileLang as Language);
            return;
          }
        }
        
        // Fallback to global settings
        const savedSettings = localStorage.getItem('gameStringerSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.system?.language && translations[settings.system.language as Language]) {
            setLanguageState(settings.system.language as Language);
            return;
          }
        }

        // Default to Russian if nothing set
        setLanguageState('ru');
      } catch (e: unknown) {
        clientLogger.warn('Failed to load language setting:', e);
      }
    };
    
    loadLanguage();
    
    // Listen for profile changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gamestringer_current_profile') {
        loadLanguage();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Apply document direction and html lang attribute when language changes
  useEffect(() => {
    applyDocumentDirection(language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    applyDocumentDirection(lang);
    
    try {
      const profileId = getCurrentProfileId();
      
      // Save per profile
      if (profileId) {
        localStorage.setItem(`gs_language_${profileId}`, lang);
      }
      
      // Also update global settings as fallback
      const savedSettings = localStorage.getItem('gameStringerSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings.system = { ...settings.system, language: lang };
      localStorage.setItem('gameStringerSettings', JSON.stringify(settings));
    } catch (e: unknown) {
      clientLogger.warn('Failed to save language setting:', e);
    }
  }, []);

  // Translation function with dot notation and case-insensitive fallback support
  const t = useCallback((key: string): string => {
    if (!key) return '';
    const keys = key.split('.');
    
    // Helper to traverse
    const resolveKey = (targetLang: Language): unknown => {
      let value: unknown = translations[targetLang];
      for (const k of keys) {
        if (value && typeof value === 'object') {
          const dict = value as Record<string, unknown>;
          if (k in dict) {
            value = dict[k];
          } else {
            // Case-insensitive key match fallback
            const lowerK = k.toLowerCase();
            const foundKey = Object.keys(dict).find(curK => curK.toLowerCase() === lowerK);
            if (foundKey) {
              value = dict[foundKey];
            } else {
              return undefined;
            }
          }
        } else {
          return undefined;
        }
      }
      return value;
    };

    const activeLang = language || 'ru';

    // 1. Try selected language
    let resolved = resolveKey(activeLang);
    if (typeof resolved === 'string') return resolved;

    // 2. Fallback to Russian
    if (activeLang !== 'ru') {
      resolved = resolveKey('ru');
      if (typeof resolved === 'string') return resolved;
    }

    // 3. Fallback to English
    if (activeLang !== 'en') {
      resolved = resolveKey('en');
      if (typeof resolved === 'string') return resolved;
    }

    // 4. Fallback to Italian
    resolved = resolveKey('it');
    if (typeof resolved === 'string') return resolved;

    return key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

export { translations, type Language, type TranslationKeys };




