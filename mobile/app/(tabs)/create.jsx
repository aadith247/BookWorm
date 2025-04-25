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
import { useRouter } from "expo-router";
import getStyles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import i18n from "../../lib/i18n";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../constants/api";

// Debounce function (copied from index.jsx)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function Create() {
  const { colors } = useThemeStore();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [tagsInput, setTagsInput] = useState("");
  const [image, setImage] = useState(null); // to display the selected image
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for checking book existence
  const [debouncedTitle, setDebouncedTitle] = useState(title);
  const [bookExists, setBookExists] = useState(false);
  const [isCheckingBook, setIsCheckingBook] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  // Debounce title input
  const debouncedSetTitle = useMemo(() => debounce(setDebouncedTitle, 500), []); // 500ms delay

  useEffect(() => {
    debouncedSetTitle(title.trim()); // Trim title before debouncing
  }, [title, debouncedSetTitle]);

  // Effect to check book existence when debouncedTitle changes
  useEffect(() => {
    const checkBookExistence = async () => {
      if (!debouncedTitle || !token) {
         setBookExists(false); // Reset if title is empty or no token
         return;
      }

      setIsCheckingBook(true);
      try {
        const response = await fetch(`${API_URL}/books/check?title=${encodeURIComponent(debouncedTitle)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
           // Handle non-2xx responses gracefully, maybe assume doesn't exist or log error
           console.error("Error checking book:", response.status);
           setBookExists(false); // Assume not found on error for safety
           return;
        }
        const data = await response.json();
        setBookExists(data.exists);
      } catch (error) {
        console.error("Failed to fetch book existence:", error);
        setBookExists(false); // Assume not found on network error
      } finally {
        setIsCheckingBook(false);
      }
    };

    checkBookExistence();
  }, [debouncedTitle, token]); // Re-run check if title or token changes

  console.log(token);

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for smaller base64
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // if base64 is provided, use it

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          // otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleSubmit = async () => {
    // Adjust validation: imageBase64 is only required if the book *doesn't* exist
    if (!title || !caption || (!imageBase64 && !bookExists) || !rating) {
      Alert.alert(
         "Error",
         `Please fill in all required fields.`
       );
      return;
    }

    // Process tags: split by comma, trim whitespace, remove empty strings
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      setLoading(true);

      let imageDataUrl = null;
      // Only include image data if it was selected AND the book doesn't already exist
      if (imageBase64) {
         const uriParts = image.split(".");
         const fileType = uriParts[uriParts.length - 1];
         const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
         imageDataUrl = `data:${imageType};base64,${imageBase64}`;
      }

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          // Conditionally send image data
          ...(imageDataUrl && { image: imageDataUrl }),
          tags,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "Your book recommendation has been posted!");
      setTitle("");
      setCaption("");
      setRating(3);
      setTagsInput("");
      setImage(null);
      setImageBase64(null);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('create.title')}</Text>
            <Text style={styles.subtitle}>{i18n.t('create.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            {/* BOOK TITLE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{i18n.t('create.bookTitleLabel')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('create.bookTitleLabel')}
                  placeholderTextColor={colors.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* RATING */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{i18n.t('create.ratingLabel')}</Text>
              {renderRatingPicker()}
            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{i18n.t('create.imageLabel')}</Text>
              {isCheckingBook ? (
                 <ActivityIndicator size="small" color={colors.primary} style={{ alignSelf: 'center', marginVertical: 20 }}/>
              ) : bookExists ? (
                <View style={styles.warningContainer}>
                   <Ionicons name="information-circle-outline" size={20} color={colors.warningText} />
                   <Text style={styles.warningText}>{i18n.t('create.bookExistsWarning')}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                      <Text style={styles.placeholderText}>{i18n.t('create.imageLabel')}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* CAPTION */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{i18n.t('create.captionLabel')}</Text>
              <TextInput
                style={styles.textArea}
                placeholder={i18n.t('create.captionLabel')}
                placeholderTextColor={colors.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* TAGS */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{i18n.t('create.tagsLabel')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="pricetags-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('create.tagsLabel')}
                  placeholderTextColor={colors.placeholderText}
                  value={tagsInput}
                  onChangeText={setTagsInput}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={colors.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>{i18n.t('create.shareButton')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
