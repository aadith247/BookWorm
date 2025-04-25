import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../store/authStore";
import getStyles from "../assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

export default function LogoutButton({ colors }) {
  const { logout } = useAuthStore();

  const styles = useMemo(() => getStyles(colors || {}), [colors]);

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  if (!colors) return null;

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={colors.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
