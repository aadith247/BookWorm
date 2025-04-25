import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import getStyles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import i18n from "../../lib/i18n";
import { emailSchema } from "../../lib/validation"; // Import Zod schema

export default function Signup() {
  const { colors } = useThemeStore();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, register, token } = useAuthStore();

  const router = useRouter();

  const handleSignUp = async () => {
    // Validate email
    const validationResult = emailSchema.safeParse({ email });

    if (!validationResult.success) {
      // Extract error message
      const firstError = validationResult.error.errors[0]?.message || i18n.t("signup.invalidEmail"); // Fallback message
      Alert.alert(i18n.t("signup.validationErrorTitle"), firstError); // Show alert
      return; // Stop submission
    }

    // Proceed with registration if validation passes
    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert(i18n.t("signup.registrationErrorTitle"), result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t("signup.title")}</Text>
            <Text style={styles.subtitle}>{i18n.t("signup.subtitle")}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t("signup.usernameLabel")}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("signup.usernamePlaceholder")}
                  placeholderTextColor={colors.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t("signup.emailLabel")}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("signup.emailPlaceholder")}
                  placeholderTextColor={colors.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t("signup.passwordLabel")}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("signup.passwordPlaceholder")}
                  placeholderTextColor={colors.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{i18n.t("signup.signupButton")}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{i18n.t("signup.loginPrompt")}</Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)")}>
                <Text style={styles.link}>{i18n.t("signup.loginLink")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
