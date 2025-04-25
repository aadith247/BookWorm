import { View, Text } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Image } from "expo-image";
import getStyles from "../assets/styles/profile.styles";
import { formatMemberSince } from "../lib/utils";
import { useMemo } from "react";

export default function ProfileHeader({ colors }) {
  const { user } = useAuthStore();

  const styles = useMemo(() => getStyles(colors || {}), [colors]);

  if (!user || !colors) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>🗓️ Joined {formatMemberSince(user.createdAt)}</Text>
      </View>
    </View>
  );
}
