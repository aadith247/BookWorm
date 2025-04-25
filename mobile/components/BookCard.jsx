import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import i18n from '../lib/i18n'; // Adjust path if necessary
import { formatPublishDate } from '../lib/utils'; // Adjust path if necessary
import getStyles from '../assets/styles/home.styles'; // Adjust path if necessary

// Helper function to render stars (copied from index.jsx)
const renderRatingStars = (rating, themeColors) => {
  const stars = [];
  const starColor = "#f4b400";
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={16}
        color={i <= rating ? starColor : themeColors.textSecondary}
        style={{ marginRight: 2 }}
      />
    );
  }
  return stars;
};

// Helper function to open links (copied from index.jsx)
const handleOpenLink = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`Don't know how to open this URL: ${url}`);
    Alert.alert("Error", "Cannot open the link."); // Provide user feedback
  }
};


export default function BookCard({ aggregatedBook, colors }) {
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isExpanded, setIsExpanded] = useState(false); // State for expansion

  // Determine reviews to show
  const reviewsToShow = isExpanded ? aggregatedBook.reviews : aggregatedBook.reviews.slice(0, 3);
  const canToggle = aggregatedBook.reviews.length > 3;

  const toggleExpand = () => {
      setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.bookCard}>
      {/* Header: Now includes Title (with Tooltip) and Average Rating */}
      <View style={styles.bookHeader}>
        {/* Moved Book Title Here and wrapped with Tooltip */}
        <Tooltip
          content={<Text style={{ color: colors.tooltipText }}>{aggregatedBook.title}</Text>}
          placement="bottom"
          backgroundColor={colors.tooltipBackground}
          useInteractionManager={true}
        >
          <Text style={styles.bookTitle} numberOfLines={1}>{aggregatedBook.title}</Text>
        </Tooltip>

        {/* Display Average Rating - Pushed to the right */}
        <View style={[styles.ratingContainer, { marginLeft: 'auto' }]}>
          <View style={{ flexDirection: 'row' }}>
            {renderRatingStars(aggregatedBook.averageRating, colors)}
          </View>
          <Text style={styles.averageRatingText}> ({aggregatedBook.averageRating.toFixed(1)})</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={aggregatedBook.image} style={styles.bookImage} contentFit="cover" />
      </View>

      <View style={styles.bookDetails}>
        {/* List reviews/captions */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsHeader}>Reviews ({aggregatedBook.reviewCount}):</Text>
          {reviewsToShow.map((review, index) => ( // Use reviewsToShow
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewCaption}>{review.caption}</Text>
              <View style={styles.reviewMeta}>
                {renderRatingStars(review.rating, colors)}
                <Text style={styles.reviewUser}> - {review.user?.username || 'Unknown'}</Text>
                <Text style={styles.reviewDate}> ({formatPublishDate(review.createdAt)})</Text>
              </View>
            </View>
          ))}
           {/* Show More/Less Button */}
           {canToggle && (
             <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
               <Text style={styles.toggleButtonText}>
                 {isExpanded ? i18n.t('common.showLess') : i18n.t('common.showMore')}
               </Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={16}
                  color={colors.primary}
                  style={styles.toggleButtonIcon}
                />
             </TouchableOpacity>
           )}
        </View>

        {/* Display Aggregated Tags */}
        {aggregatedBook.tags && aggregatedBook.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {aggregatedBook.tags.map((tag, index) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Optionally, display the date of the *first* review */}
        <Text style={styles.date}>First shared on {formatPublishDate(aggregatedBook.createdAt)}</Text>

        {/* Purchase Button */}
        {aggregatedBook.purchaseLink && (
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={() => handleOpenLink(aggregatedBook.purchaseLink)}
          >
            <Ionicons name="cart-outline" size={18} color={colors.buttonText} style={{ marginRight: 5 }} />
            <Text style={styles.purchaseButtonText}>{i18n.t('profile.buy_on_amazon')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 