import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "../store/themeStore";

export default function SafeScreen({ children, style }) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeStore();

  const combinedStyle = StyleSheet.compose(
    [styles.container, { backgroundColor: colors.background, paddingTop: insets.top }],
    style
  );

  return <View style={combinedStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
