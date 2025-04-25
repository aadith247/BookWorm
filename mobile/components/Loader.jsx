import { View, Text, ActivityIndicator } from "react-native";
// import COLORS from "../constants/colors"; // Remove old import

// Accept colors prop
export default function Loader({ size = "large", colors }) { 
  // Define a default fallback if colors are not passed (optional)
  const themedColors = colors || { background: '#f0f0f0', primary: '#0000ff' }; 

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // Use themed background color
        backgroundColor: themedColors.background, 
      }}
    >
      {/* Use themed primary color */}
      <ActivityIndicator size={size} color={themedColors.primary} /> 
    </View>
  );
}
