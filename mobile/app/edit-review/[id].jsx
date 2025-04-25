import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import getStyles from "../../assets/styles/create.styles.js"; // Corrected relative path
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore"; // Corrected path
import { useThemeStore } from "../../store/themeStore"; // Corrected path
import i18n from "../../lib/i18n"; // Corrected path
import { API_URL } from "../../constants/api"; // Corrected path

export default function EditReview() {
  const { colors } = useThemeStore();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const router = useRouter();
  const { token } = useAuthStore();

  // Get parameters passed from profile screen
  const params = useLocalSearchParams();
  const { id, title: initialTitle, caption: initialCaption, rating: initialRating, tags: initialTagsString, image: initialImage } = params;

  const [caption, setCaption] = useState(initialCaption || '');
  const [rating, setRating] = useState(initialRating ? parseInt(initialRating, 10) : 3);
  const [tagsInput, setTagsInput] = useState(initialTagsString ? JSON.parse(initialTagsString).join(', ') : '');
  const [loading, setLoading] = useState(false);

  // Title and Image are generally not editable for a review
  const title = initialTitle || 'Book Title Missing';
  const image = initialImage;

  useEffect(() => {
      // Log params on mount for debugging
      console.log("Edit screen params:", params);
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (!caption || !rating) {
      Alert.alert("Error", "Caption and rating are required.");
      return;
    }

    // Process tags
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Only send fields that were potentially edited
          caption,
          rating,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
          // Handle specific errors like 403 Forbidden, 404 Not Found, 409 Conflict etc.
          throw new Error(data.message || "Failed to update review.");
      }

      Alert.alert("Success", "Review updated successfully!");
      // Go back to the previous screen (profile)
      if (router.canGoBack()) {
          router.back();
      } else {
          // Fallback if cannot go back (e.g., deep link)
          router.replace('/(tabs)/profile');
      }

    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", error.message || "Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  // --- Rating Picker (copied from Create screen) ---
  const renderRatingPicker = () => {
    const stars = [];
    const starColor = "#f4b400";
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? starColor : colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            {/* Use a different title, e.g., "Edit Review" */}
            <Text style={styles.title}>Edit Your Review</Text>
            <Text style={styles.subtitle}>Update your thoughts on "{title}"</Text>
          </View>

          <View style={styles.form}>
             {/* Display Existing Image (Read-only) */}
             {image && (
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Book Image</Text>
                    <Image source={{ uri: image }} style={[styles.previewImage, styles.readOnlyImage]} />
                </View>
             )}

             {/* Display Title (Read-only) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.readOnlyInput]} // Add read-only style
                  value={title}
                  editable={false} // Make non-editable
                />
              </View>
            </View>

            {/* RATING (Editable) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* CAPTION (Editable) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Update your caption..."
                placeholderTextColor={colors.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* TAGS (Editable) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tags (comma-separated)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="pricetags-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Update tags..."
                  placeholderTextColor={colors.placeholderText}
                  value={tagsInput}
                  onChangeText={setTagsInput}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 