import { Appearance } from 'react-native';

// Base colors from your FOREST theme (Light)
const lightColors = {
  primary: "#4CAF50",        // Green
  textPrimary: "#1B5E20",    // Darker Green for high contrast text
  textSecondary: "#4CAF50",  // Medium Green for secondary text
  textLight: "#66BB6A",     // Lighter Green
  placeholderText: "#757575",  // Standard gray
  background: "#E8F5E9",    // Very light green
  cardBackground: "#FFFFFF",  // White cards for contrast
  inputBackground: "#F1F8F1", // Slightly off-white green tint
  border: "#C8E6C9",        // Light green border
  white: "#FFFFFF",
  black: "#000000",
  danger: '#D32F2F',       // Standard red for errors/delete
  warning: '#FFA000',      // Standard orange/yellow for warnings
  info: '#1976D2',         // Standard blue for info
  success: '#388E3C',       // Darker green for success
};

// Corresponding Dark Theme
const darkColors = {
  primary: "#66BB6A",        // Lighter Green for primary actions in dark mode
  textPrimary: "#E8F5E9",    // Very light green/almost white for main text
  textSecondary: "#A5D6A7",  // Lighter green for secondary text
  textLight: "#C8E6C9",     // Even lighter green
  placeholderText: "#9E9E9E",  // Lighter gray for placeholders
  background: "#1B2B1B",    // Very dark green/almost black
  cardBackground: "#2E3C2E",  // Dark gray-green for cards
  inputBackground: "#253325", // Slightly lighter dark green for inputs
  border: "#385038",        // Dark green border
  white: "#FFFFFF",
  black: "#000000",
  danger: '#EF5350',       // Lighter red
  warning: '#FFB74D',      // Lighter orange
  info: '#64B5F6',         // Lighter blue
  success: '#81C784',       // Lighter success green
};

export const themes = {
  light: lightColors,
  dark: darkColors,
};

// Function to get the initial theme based on system preference
export const getInitialTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}; 