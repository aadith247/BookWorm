// styles/home.styles.js
import { StyleSheet } from "react-native";
// import COLORS from "../../constants/colors"; // Remove old import

// Export a function that takes colors and returns the styles
const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Use themed color
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background, // Use themed color
    },
    listContainer: {
      padding: 16,
      paddingBottom: 80, // Adjust if needed based on tab bar height
    },
    header: {
      marginBottom: 20,
      paddingHorizontal: 10, // Add some horizontal padding
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "JetBrainsMono-Medium",
      letterSpacing: 0.5,
      color: colors.primary, // Use themed color
      marginBottom: 8,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary, // Use themed color
      textAlign: "center",
      marginBottom: 15, // Add space before search bar
    },
    searchContainer: { // Added styles for search bar
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: { // Added styles for search icon
      marginRight: 8,
    },
    searchInput: { // Added styles for search input
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
    },
    bookCard: {
      backgroundColor: colors.cardBackground, // Use themed color
      borderRadius: 16,
      marginBottom: 20,
      padding: 16,
      shadowColor: colors.black, // Use themed color (though shadow might not change much)
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border, // Use themed color
    },
    bookHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
      backgroundColor: colors.border, // Added background for placeholder
    },
    username: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary, // Use themed color
    },
    bookImageContainer: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 12,
      backgroundColor: colors.border, // Use themed color
    },
    bookImage: {
      width: "100%",
      height: "100%",
    },
    bookDetails: {
      paddingHorizontal: 4, // Add horizontal padding
    },
    bookTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary, // Use themed color
      flex: 1, // Allow title to take available space and shrink
      marginRight: 8, // Add space between title and rating
    },
    ratingContainer: {
      flexDirection: "row",
      marginBottom: 8,
      // Star color is handled inline in the component
    },
    caption: {
      fontSize: 14,
      color: colors.textPrimary, // Changed from textDark for better dark mode visibility
      marginBottom: 10, // Increased spacing
      lineHeight: 20,
      marginTop: 4, // Add some top margin
    },
    tagsContainer: { // Added styles for tags
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
      marginTop: 4,
    },
    tagChip: { // Added styles for tag chip
      backgroundColor: colors.primary + '20', // Primary color with low opacity
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginRight: 6,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: colors.primary + '50', // Primary color with medium opacity
    },
    tagText: { // Added styles for tag text
      color: colors.primary, // Use primary color for tag text
      fontSize: 12,
      fontWeight: '500',
    },
    date: {
      fontSize: 12,
      color: colors.textSecondary, // Use themed color
      marginTop: 4, // Add some top margin
    },
    emptyContainer: {
      flex: 1, // Make it take available space
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      marginTop: '20%', // Adjust vertical position
      // Color is set inline in the component
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textPrimary, // Use themed color
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary, // Use themed color
      textAlign: "center",
    },
    footerLoader: {
      marginVertical: 20,
      // Color is set inline in the component
    },
    // >>> Styles for Aggregated View <<<
    averageRatingText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 5, // Space after stars
      fontWeight: '500',
    },
    reviewsContainer: {
      marginTop: 15, // Space above the reviews list
      marginBottom: 10, // Space below the reviews list
      borderTopWidth: 1, // Separator line
      borderTopColor: colors.border,
      paddingTop: 10, // Space below the separator
    },
    reviewsHeader: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    reviewItem: {
      marginBottom: 10,
      paddingLeft: 10, // Indent reviews slightly
      borderLeftWidth: 2,
      borderLeftColor: colors.primary + '40', // Use a theme color (primary with opacity)
    },
    reviewCaption: {
      fontSize: 14,
      color: colors.textPrimary,
      marginBottom: 4, // Space between caption and meta
      lineHeight: 18,
    },
    reviewMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2, // Small space above meta
    },
    reviewUser: {
       fontSize: 12,
       color: colors.textSecondary,
       marginLeft: 6, // Space after stars/rating
       fontWeight: '500',
    },
     reviewDate: {
       fontSize: 11,
       color: colors.textSecondary,
       marginLeft: 5,
    },
    purchaseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary, // Or another suitable color
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20, // Rounded corners
      marginTop: 15,
      alignSelf: 'center', // Center the button
      elevation: 2, // Android shadow
      shadowColor: colors.shadow, // iOS shadow
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
    purchaseButtonText: {
      color: colors.buttonText, // Ensure this color contrasts with button background
      fontSize: 14,
      fontWeight: 'bold',
    },
    toggleButton: { // Styles for Show More/Less
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      marginTop: 10, // Space above the button
      // alignSelf: 'flex-start', // Align to the left under reviews
    },
    toggleButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    toggleButtonIcon: {
      marginLeft: 4,
    },
    // >>> End Styles for Aggregated View <<<
  });

export default getStyles; // Export the function
