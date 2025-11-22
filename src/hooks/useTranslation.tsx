import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '@/lib/i18n';
import type { Translation } from '@/lib/translations';
import { detectBrowserLanguage, saveLanguagePreference, getTextDirection, isRTL } from '@/lib/i18n';
import { translations } from '@/lib/translations';

interface I18nContextType {
  language: Language;
  t: Translation;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
    
    // Update document direction and lang attribute
    document.documentElement.dir = getTextDirection(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial direction and lang
    document.documentElement.dir = getTextDirection(language);
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    t: translations[language],
    setLanguage,
    isRTL: isRTL(language),
    direction: getTextDirection(language)
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}