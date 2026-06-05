import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import de from './locales/de/translation.json';
import en from './locales/en/translation.json';

/**
 * i18n-Konfiguration für Bookando 2.1
 *
 * Sprach-Strategie (per Pflichtenheft):
 *   1. Wenn der User eine Sprache via LanguageSwitcher gewählt hat → localStorage
 *   2. Wenn ein eingeloggter User eine Profil-Sprache hat → AuthContext.syncLanguage()
 *   3. Sonst: DE als Default (kein Browser-Sniffing, da DE die Produkt-Standardsprache ist)
 *   4. Fallback bei fehlenden Keys: DE
 *
 * Damit bleibt der Cookie-Banner, Public-Footer und alle Legal-Pages konsistent in
 * der vom User gewählten Sprache und fallen nicht stillschweigend auf die
 * Browser-Sprache zurück.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { de: { translation: de }, en: { translation: en } },
    fallbackLng: 'de',
    lng: undefined, // Detector entscheidet
    supportedLngs: ['de', 'en'],
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
    detection: {
      // Bewusst KEIN 'navigator': DE ist Produkt-Standard, EN ist explizit opt-in
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
