import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, getInitialTheme } from '../constants/themes';

const THEME_STORAGE_KEY = 'app_theme';
const LOCALE_STORAGE_KEY = 'app_locale';

export const useThemeStore = create((set, get) => ({
  // State
  theme: getInitialTheme(), // Initialize with system preference or default
  colors: themes[getInitialTheme()], // Initialize colors based on initial theme
  locale: 'en', // Initial locale default, will be updated

  // Actions
  setTheme: (themeName) => {
    if (themes[themeName]) {
      set({ theme: themeName, colors: themes[themeName] });
      AsyncStorage.setItem(THEME_STORAGE_KEY, themeName).catch((error) => {
        console.error("AsyncStorage Error: Failed to save theme", error);
      });
    } else {
      console.warn(`Tried to set invalid theme: ${themeName}`);
    }
  },

  setAppLocale: (localeCode) => {
    // We assume the localeCode is valid here, validation happens in i18n.js
    set({ locale: localeCode });
    AsyncStorage.setItem(LOCALE_STORAGE_KEY, localeCode).catch((error) => {
      console.error("AsyncStorage Error: Failed to save locale", error);
    });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  // Function to load preferences (theme & locale) from storage
  loadPreferencesFromStorage: async () => {
    try {
      // Load Theme
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && themes[storedTheme]) {
        console.log("Loading theme from storage:", storedTheme);
        set({ theme: storedTheme, colors: themes[storedTheme] });
      } else {
        const initialTheme = getInitialTheme();
        console.log("No theme in storage, using initial theme:", initialTheme);
        set({ theme: initialTheme, colors: themes[initialTheme] });
        // AsyncStorage.setItem(THEME_STORAGE_KEY, initialTheme); // Don't save default back
      }

      // Load Locale
      const storedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (storedLocale) { // Check if storedLocale is not null/undefined
        // We'll let i18n.js handle setting the actual i18n.locale initially
        // But we update the store state here to reflect the preference
        console.log("Loading locale from storage:", storedLocale);
        set({ locale: storedLocale });
      } else {
        console.log("No locale in storage, will rely on device detection or default.");
        // Leave the store locale as the default 'en' or whatever i18n sets initially
      }

    } catch (error) {
      console.error("AsyncStorage Error: Failed to load preferences", error);
      // Fallback to initial theme if loading fails
      const initialTheme = getInitialTheme();
      set({ theme: initialTheme, colors: themes[initialTheme] });
      // Locale will use initial default 'en'
    }
  },
}));

// Optional: Immediately attempt to load the theme when the store is initialized
// This might run before the app root is fully ready, but often works.
// A more robust approach is calling loadThemeFromStorage in the root layout.
// useThemeStore.getState().loadThemeFromStorage(); 