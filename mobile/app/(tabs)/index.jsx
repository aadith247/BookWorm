import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import i18n from "../../lib/i18n";

import { Image } from "expo-image";
import { useEffect, useState, useMemo } from "react";

import getStyles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";
import Tooltip from 'react-native-walkthrough-tooltip';
import * as Linking from 'expo-linking';
import BookCard from "../../components/BookCard";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Debounce function (simple implementation)
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

export default function Home() {
  const { token } = useAuthStore();
  const { colors } = useThemeStore();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // State for tags input
  const [debouncedTagsInput, setDebouncedTagsInput] = useState(""); // State for debounced tags

  // Debounce the search term update
  const debouncedSetSearch = debounce(setDebouncedSearchTerm, 500); // 500ms delay
  const debouncedSetTags = debounce(setDebouncedTagsInput, 500); // Debounce tags input

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => { // Debounce tags
    debouncedSetTags(tagsInput);
  }, [tagsInput]);

  // Add a log for the token when the component mounts or token changes
  useEffect(() => {
    console.log("Auth Token:", token ? token.substring(0, 10) + '...' : 'No Token');
  }, [token]);

  const fetchBooks = async (pageNum = 1, refresh = false, currentSearchTerm = debouncedSearchTerm, currentTagsTerm = debouncedTagsInput) => {
    // Always reset page to 1 if search term or tags change or it's a refresh
    const isNewSearch = currentSearchTerm !== debouncedSearchTerm || currentTagsTerm !== debouncedTagsInput;
    const targetPage = refresh || isNewSearch ? 1 : pageNum;

    // Allow the very first fetch (page 1, not a refresh) to proceed even if loading is true initially.
    // Prevent other overlapping fetches.
    const isInitialEffectLoad = pageNum === 1 && !refresh;
    if ((loading || refreshing) && !isInitialEffectLoad) {
      console.log(`Fetch skipped: Already loading (${loading}) or refreshing (${refreshing}). Not initial effect load.`);
      return;
    }
    // Prevent fetching subsequent pages if no more exist (this check only relevant for pageNum > 1)
    if (!hasMore && pageNum > 1 && !refresh) {
      console.log(`Fetch skipped: No more pages (hasMore: ${hasMore}, pageNum: ${pageNum}). Not a refresh.`);
      return;
    }

    console.log(`Fetching books - Page: ${targetPage}, Refresh: ${refresh}, Search: '${currentSearchTerm}', Tags: '${currentTagsTerm}'`);
    console.log("Using Token:", token ? token.substring(0, 10) + '...' : 'No Token');

    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      console.log("Loading state set to true");

      // Build API URL
      let apiUrl = `${API_URL}/books?page=${targetPage}&limit=5`;
      if (currentSearchTerm) {
        apiUrl += `&search=${encodeURIComponent(currentSearchTerm)}`;
      }
      if (currentTagsTerm) { // Add tags query parameter
        apiUrl += `&tags=${encodeURIComponent(currentTagsTerm)}`;
      }

      console.log("Fetching URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`); // Improved error message

      console.log("Received data:", data.books.length, "books", "TotalPages:", data.totalPages);

      // Update books state
      setBooks((prevBooks) => {
        if (refresh || targetPage === 1) {
          return data.books; // Replace books on refresh or first page
        }
        // Prevent duplicates when loading more (simple check by ID)
        const newBooks = data.books.filter(newBook => !prevBooks.some(prevBook => prevBook._id === newBook._id));
        return [...prevBooks, ...newBooks];
      });

      // Update pagination state
      setHasMore(targetPage < data.totalPages);
      setPage(targetPage);
      console.log("Updated state - Page:", targetPage, "HasMore:", targetPage < data.totalPages);

    } catch (error) {
      console.error("ERROR fetching books:", error);
    } finally {
      if (refresh) {
        await sleep(500);
        setRefreshing(false);
        console.log("Refreshing state set to false");
      }
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  // Fetch initial books or when debounced search/tags term changes
  useEffect(() => {
    if (token) {
      console.log("Token loaded. Fetching based on search term:", debouncedSearchTerm, "and tags:", debouncedTagsInput);
      // Fetch books for the first page, not as a refresh, using the current debounced terms
      fetchBooks(1, false, debouncedSearchTerm, debouncedTagsInput);
    } else {
      console.log("Token not yet available. Skipping fetch.");
      // Optional: You might want to set loading to false here if no token means no data
      // setLoading(false);
    }
  }, [debouncedSearchTerm, debouncedTagsInput, token]); // Re-run if token or search/tags term changes

  // AGGREGATION LOGIC
  const aggregatedBooks = useMemo(() => {
    if (!books || books.length === 0) {
      return [];
    }

    // Sort books by creation date (oldest first) before aggregating
    const sortedBooks = [...books].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const booksMap = new Map();

    sortedBooks.forEach((book) => {
      const titleKey = book.title.toLowerCase(); // Case-insensitive key
      if (!booksMap.has(titleKey)) {
        booksMap.set(titleKey, {
          // Use details from the first encountered review for this title
          _id: `${titleKey}-${book._id}`, // Create a unique ID for the group
          title: book.title,
          image: book.image, // Use image from the first review
          user: book.user, // Use user from the first review
          createdAt: book.createdAt, // Use date from the first review
          tags: book.tags || [], // Use tags from first review
          purchaseLink: book.purchaseLink, // <-- Add purchaseLink from the first book
          // Aggregated fields
          reviews: [{ rating: book.rating, caption: book.caption, user: book.user, createdAt: book.createdAt }], // Store individual reviews
          totalRating: book.rating,
          reviewCount: 1,
        });
      } else {
        const existing = booksMap.get(titleKey);
        existing.reviews.push({ rating: book.rating, caption: book.caption, user: book.user, createdAt: book.createdAt });
        existing.totalRating += book.rating;
        existing.reviewCount += 1;
        // Optionally update tags: aggregate unique tags
        if (book.tags) {
          book.tags.forEach(tag => {
            if (!existing.tags.includes(tag)) {
              existing.tags.push(tag);
            }
          });
        }
      }
    });

    // Calculate average rating and return as array
    return Array.from(booksMap.values()).map(book => ({
      ...book,
      averageRating: book.reviewCount > 0 ? book.totalRating / book.reviewCount : 0,
      // Sort reviews by date, newest first
      reviews: book.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    }));
  }, [books]); // Re-run aggregation only when 'books' changes

  const handleRefresh = () => {
    // Pass current debounced terms to refresh
    fetchBooks(1, true, debouncedSearchTerm, debouncedTagsInput);
  };

  const handleLoadMore = () => {
    if (!loading && !refreshing && hasMore) {
      // Pass current debounced terms to load more
      fetchBooks(page + 1, false, debouncedSearchTerm, debouncedTagsInput);
    }
  };

  // Simplified renderItem using the BookCard component
  const renderItem = ({ item: aggregatedBook }) => (
    <BookCard aggregatedBook={aggregatedBook} colors={colors} />
  );

  // Pass colors to Loader
  if (loading && page === 1 && !refreshing) return <Loader colors={colors} />;

  // Log books state just before rendering
  console.log("Rendering Home with books:", books.length, "books");

  return (
    <View style={styles.container}>
      <FlatList
        data={aggregatedBooks} // Use the aggregated data
        renderItem={renderItem}
        keyExtractor={(item) => item._id} // Use the generated unique group ID
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{i18n.t('home.title')}</Text>
            <Text style={styles.headerSubtitle}>{i18n.t('home.subtitle')}</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={i18n.t('home.searchPlaceholder')}
                placeholderTextColor={colors.placeholderText}
                value={searchTerm}
                onChangeText={setSearchTerm}
                returnKeyType="search"
              />
            </View>
            {/* Tags Filter Input */}
             <View style={[styles.searchContainer, { marginTop: 10 }]}> 
              <Ionicons name="pricetags-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={i18n.t('home.tagsPlaceholder')} // Add new translation key
                placeholderTextColor={colors.placeholderText}
                value={tagsInput}
                onChangeText={setTagsInput}
                returnKeyType="search"
                autoCapitalize="none"
              />
            </View>
          </View>
        }
        ListFooterComponent={
          loading && !refreshing && page > 0 && hasMore ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={colors.primary} />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing && (
             <View style={styles.emptyContainer}>
               <Ionicons name="sad-outline" size={60} color={colors.textSecondary} />
               <Text style={styles.emptyText}>{i18n.t('home.noRecommendations')}</Text>
               {debouncedSearchTerm || debouncedTagsInput ? ( // Check if search OR tags are active
                 <Text style={styles.emptySubtext}>{i18n.t('home.searchEmptySubtext')}</Text>
               ) : (
                 <Text style={styles.emptySubtext}>{i18n.t('home.noRecommendationsSubtext')}</Text>
               )}
             </View>
           )
        }
      />
    </View>
  );
}
