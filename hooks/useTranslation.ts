import { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageContext';

export const useTranslation = () => useContext(LanguageContext);
