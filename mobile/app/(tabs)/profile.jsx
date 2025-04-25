import { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import getStyles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { sleep } from ".";
import Loader from "../../components/Loader";
import i18n from "../../lib/i18n";
import { Picker } from "@react-native-picker/picker";
import { setLocale } from "../../lib/i18n";

export default function Profile() {
  const { theme, colors, toggleTheme, locale } = useThemeStore();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const { token } = useAuthStore();

  const router = useRouter();

  // Memoize fetchData to prevent it from being recreated on every render
  const fetchData = useCallback(async () => {
    // Added check for token existence before fetching
    if (!token) {
      console.log("No token found, skipping fetch for user books.");
      setIsLoading(false); // Ensure loading stops if no token
      setBooks([]); // Clear books if no token
      return;
    }
    try {
      // Set loading only if not already refreshing (to avoid flicker)
      if (!refreshing) setIsLoading(true);

      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user books");

      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      if (!refreshing) setIsLoading(false);
    }
  }, [token, refreshing]);

  // Use useFocusEffect to fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Profile screen focused, fetching data...");
      fetchData();

      // Optional: Return a cleanup function if needed
      return () => {
        // console.log("Profile screen blurred/unmounted");
        // Cleanup tasks if necessary
      };
    }, [fetchData]) // Dependency: the memoized fetchData function
  );

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete book");

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) },
    ]);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating, colors)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity 
         style={styles.editButton}
         onPress={() => { 
             console.log('Attempting to navigate to edit-review with params:', item._id);
             router.push({ pathname: '/edit-review', params: { 
                 id: item._id, 
                 title: item.title,
                 caption: item.caption,
                 rating: item.rating,
                 tags: JSON.stringify(item.tags || []),
                 image: item.image
             } });
         }}
      >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={colors.danger} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating, themeColors) => {
    const stars = [];
    const starColor = "#f4b400";
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? starColor : themeColors.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader colors={colors} />;

  // Define available languages
  const availableLanguages = [
    { code: 'en', nameKey: 'languages.en' },
    { code: 'hi', nameKey: 'languages.hi' },
    { code: 'ta', nameKey: 'languages.ta' },
    { code: 'te', nameKey: 'languages.te' },
  ];

  return (
    <View style={styles.container}>
      <ProfileHeader colors={colors} />
      <LogoutButton colors={colors} />

      {/* --- Settings Section --- */}
      <View style={styles.settingsSection}>
      <View style={styles.themeToggleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons 
            name={theme === 'dark' ? "moon-outline" : "sunny-outline"} 
            size={20} 
            color={colors.textPrimary} 
            style={styles.themeToggleIcon} 
          />
          <Text style={styles.themeToggleText}> 
            {i18n.t('profile.theme')}
          </Text>
        </View>
        <Switch
          trackColor={{ false: colors.border, true: colors.primary + '80' }}
          thumbColor={theme === 'dark' ? colors.primary : colors.white}
          ios_backgroundColor={colors.border}
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>

      {/* Language Selector */}
      <View style={styles.languageSelectorContainer}> 
        <Text style={styles.languageSelectorLabel}>
          {i18n.t('languages.selectTitle')}
        </Text>
        <View style={styles.pickerWrapper}> 
          <Picker
            selectedValue={locale}
            onValueChange={(itemValue, itemIndex) => {
              if (itemValue) {
                setLocale(itemValue);
              }
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={colors.textPrimary}
          >
            {availableLanguages.map((lang) => (
              <Picker.Item
                key={lang.code}
                label={i18n.t(lang.nameKey)}
                value={lang.code}
                color={colors.textPrimary}
              />
            ))}
          </Picker>
        </View>
      </View>
      </View>

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>{i18n.t('profile.myRecommendations')}</Text>
        <Text style={styles.booksCount}>{i18n.t('profile.booksCount', { count: books.length })}</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{i18n.t('profile.noRecommendations')}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>{i18n.t('profile.addButton')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
