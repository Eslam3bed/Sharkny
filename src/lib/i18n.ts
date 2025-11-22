// Language detection and management
export type Language = 'ar' | 'en';

export function detectBrowserLanguage(): Language {
  if (typeof window !== 'undefined') {
    // Check localStorage first for user preference
    const savedLang = localStorage.getItem('sharkny-language') as Language;
    if (savedLang && ['ar', 'en'].includes(savedLang)) {
      return savedLang;
    }

    // Detect from browser
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    
    // Arabic language detection
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  }
  
  return 'en';
}

export function saveLanguagePreference(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sharkny-language', lang);
  }
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}

export function getTextDirection(lang: Language): 'ltr' | 'rtl' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}