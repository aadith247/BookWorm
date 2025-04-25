// styles/profile.styles.js
import { StyleSheet } from "react-native";
// import COLORS from "../../constants/colors"; // Remove old import

// Export a function that takes colors and returns the styles
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Use themed color
      padding: 16,
      paddingBottom: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background, // Use themed color
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground, // Use themed color
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
      backgroundColor: colors.border, // Add placeholder background
    },
    profileInfo: {
      flex: 1,
    },
    username: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary, // Use themed color
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary, // Use themed color
      marginBottom: 4,
    },
    memberSince: {
      fontSize: 12,
      color: colors.textSecondary, // Use themed color
    },
    logoutButton: {
      backgroundColor: colors.danger, // Use danger color for logout
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    logoutText: {
      color: colors.white, // Assuming danger color is dark enough
      fontWeight: "600",
      marginLeft: 8,
    },
    // Theme Toggle Styles - NEW
    themeToggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeToggleText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    themeToggleIcon: {
      marginLeft: 8, // Add some space before the switch
    },
    // End Theme Toggle Styles
    booksHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    booksTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary, // Use themed color
    },
    booksCount: {
      fontSize: 14,
      color: colors.textSecondary, // Use themed color
    },
    booksList: {
      // paddingBottom: 20, // Removed padding, handled by FlatList contentContainerStyle
    },
    bookItem: {
      flexDirection: "row",
      backgroundColor: colors.cardBackground, // Use themed color
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
    },
    bookImage: {
      width: 70,
      height: 100,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: colors.border, // Add placeholder background
    },
    bookInfo: {
      flex: 1,
      justifyContent: "space-between",
    },
    bookTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary, // Use themed color
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: "row",
      marginBottom: 4,
      // Star color handled inline
    },
    bookCaption: {
      fontSize: 14,
      color: colors.textPrimary, // Use themed textPrimary
      marginBottom: 4,
      flex: 1, // Allow caption to take space
    },
    bookDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    editButton: { // Style for the edit button
      padding: 8,
      marginLeft: 'auto', // Push delete to the right
    },
    deleteButton: {
      padding: 8,
      // Removed marginLeft as edit button is now pushing it
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      marginTop: 20,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary, // Use themed color
      marginTop: 16,
      marginBottom: 20,
      textAlign: "center",
    },
    addButton: {
      backgroundColor: colors.primary, // Use themed color
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addButtonText: {
      color: colors.white, // Use themed color (assuming primary is dark enough)
      fontWeight: "600",
      fontSize: 14,
    },
  });

export default getStyles;
