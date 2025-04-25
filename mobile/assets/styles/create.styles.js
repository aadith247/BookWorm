// styles/create.styles.js
import { StyleSheet } from "react-native";
// import COLORS from "../../constants/colors"; // Remove old import

// Export a function that takes colors and returns the styles
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background, // Use themed color
      padding: 16,
    },
    scrollViewStyle: {
      flex: 1,
      backgroundColor: colors.background, // Use themed color
    },
    card: {
      backgroundColor: colors.cardBackground, // Use themed color
      borderRadius: 16,
      padding: 20,
      marginVertical: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary, // Use themed color
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary, // Use themed color
      textAlign: "center",
    },
    form: {
      marginBottom: 16,
    },
    formGroup: {
      marginBottom: 20,
    },
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
      // Color is set inline in the component
    },
    input: {
      flex: 1,
      height: 48,
      color: colors.textPrimary, // Use themed color
    },
    textArea: {
      backgroundColor: colors.inputBackground, // Use themed color
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
      padding: 12,
      height: 100,
      color: colors.textPrimary, // Use themed color
      textAlignVertical: 'top', // Added for better multiline behavior
      resizeMode: "cover",
      borderRadius: 8,
      backgroundColor: colors.border, // Add a background color
    },
    ratingContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: colors.inputBackground, // Use themed color
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
      padding: 8,
    },
    starButton: {
      padding: 8,
      // Star color is handled inline in the component
    },
    imagePicker: {
      width: "100%",
      height: 200,
      backgroundColor: colors.inputBackground, // Use themed color
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
      overflow: "hidden",
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    placeholderContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    placeholderText: {
      color: colors.textSecondary, // Use themed color
      marginTop: 8,
    },
    button: {
      backgroundColor: colors.primary, // Use themed color
      borderRadius: 12,
      height: 50,
      flexDirection: "row",
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
      // Use black or white depending on primary button color for contrast
      color: colors.white, // Assuming primary is dark enough for white text
      fontSize: 16,
      fontWeight: "600",
    },
    buttonIcon: {
      marginRight: 8,
      // Color is set inline in the component
    },
    readOnlyInput: { // Style for non-editable inputs
      color: colors.textSecondary, // Make text look disabled
      backgroundColor: colors.border + '40', // Slightly different background
    },
    readOnlyImage: { // Style for non-editable images
      opacity: 0.7, // Make image look slightly faded
    },
  });

export default getStyles; // Export the function
