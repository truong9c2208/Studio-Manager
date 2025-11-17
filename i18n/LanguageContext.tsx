import React, { createContext, useState, useCallback, useMemo } from 'react';
import { en } from './locales/en';
import { vi } from './locales/vi';

const translations = { en, vi };
export type Locale = 'en' | 'vi';
export type TranslationKey = keyof typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
    locale: 'en',
    setLocale: () => {},
    t: (key: TranslationKey) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>('en');

    const t = useCallback((key: TranslationKey): string => {
        return translations[locale][key] || translations['en'][key] || key;
    }, [locale]);

    const value = useMemo(() => ({
        locale,
        setLocale,
        t
    }), [locale, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};