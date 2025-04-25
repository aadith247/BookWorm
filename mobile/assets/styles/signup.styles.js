// styles/signup.styles.js
import { StyleSheet } from "react-native";
// import COLORS from "../../constants/colors"; // Remove old import

// Export a function that takes colors and returns the styles
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background, // Use themed color
      padding: 20,
      justifyContent: "center",
    },
    scrollViewStyle: { // Added for consistency with login
      flex: 1,
      backgroundColor: colors.background, 
    },
    card: {
      backgroundColor: colors.cardBackground, // Use themed color
      borderRadius: 16,
      padding: 24,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1, // Reduced border width
      borderColor: colors.border, // Use themed color
    },
    header: {
      alignItems: "center",
      marginBottom: 32, // Keep larger margin for signup
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      fontFamily: "JetBrainsMono-Medium", // Assuming this font is loaded
      color: colors.primary, // Use themed color
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary, // Use themed color
      textAlign: "center",
    },
    formContainer: { marginBottom: 16 },
    inputGroup: { marginBottom: 20 },
    label: {
      fontSize: 14,
      marginBottom: 8,
      color: colors.textPrimary, // Use themed color
      fontWeight: "500",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBackground, // Use themed color
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
      paddingHorizontal: 12,
    },
    inputIcon: {
      marginRight: 10,
      // Icon color set inline
    },
    input: {
      flex: 1,
      height: 48,
      color: colors.textPrimary, // Use themed color
    },
    eyeIcon: {
      padding: 8,
      // Icon color set inline
    },
    button: {
      backgroundColor: colors.primary, // Use themed color
      borderRadius: 12,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      color: colors.white, // Use themed color
      fontSize: 16,
      fontWeight: "600",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    footerText: {
      color: colors.textSecondary, // Use themed color
      marginRight: 5,
    },
    link: {
      color: colors.primary, // Use themed color
      fontWeight: "600",
    },
  });

export default getStyles; // Export the function
