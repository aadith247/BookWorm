import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import translations
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';

// Import the store hook (we need getState for use outside components)
import { useThemeStore } from '../store/themeStore'; 

// Set up i18n instance
const i18n = new I18n();

// Define translations
i18n.translations = {
  en,
  hi,
  ta,
  te,
};

// --- Initial Locale Setup ---
// This setup runs when the module is first imported.
// It now considers stored preference, then device locale, then default.

let initialLocale = 'en'; // Start with default

// 1. Try getting the locale potentially loaded from storage by the store
// Note: loadPreferencesFromStorage needs to run *before* this module is heavily used,
// ideally triggered early in _layout.jsx. Accessing state here gives the *initial* store state.
const storedLocale = useThemeStore.getState().locale;
if (storedLocale && i18n.translations[storedLocale]) {
  initialLocale = storedLocale;
  console.log("i18n: Using locale from store initial state:", initialLocale);
} else {
  // 2. If no valid stored locale, try device locale
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageTag?.split('-')[0];
    if (languageCode && i18n.translations[languageCode]) {
      initialLocale = languageCode;
      console.log("i18n: Using device locale:", initialLocale);
    }
  }
}

// Set initial locale and fallback
i18n.locale = initialLocale;
i18n.defaultLocale = 'en'; // Fallback language if translation is missing
i18n.enableFallback = true;

console.log("i18n initialized. Final initial locale:", i18n.locale);

// Function to change the language dynamically
export const setLocale = (locale) => {
  if (i18n.translations[locale]) {
    i18n.locale = locale;
    // Also update the zustand store (which handles persistence)
    useThemeStore.getState().setAppLocale(locale);
    console.log("i18n locale set to:", locale, "(Store updated)");
    // Components subscribed to the store's locale will re-render
  } else {
    console.warn(`Attempted to set unsupported locale: ${locale}`);
  }
};

export default i18n; 