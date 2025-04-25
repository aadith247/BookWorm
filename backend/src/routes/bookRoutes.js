import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try 
  {
    const { title, caption, rating, image, tags } = req.body;
    // image is now optional, only validate required fields
    if (!title || !caption || !rating) {
      return res.status(400).json({ message: "Title, caption, and rating are required fields" });
    }

    // Check if the user has already reviewed this book (case-insensitive title check)
    const existingReview = await Book.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') }, // Case-insensitive match
      user: req.user._id
    });

    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this book." }); // 409 Conflict
    }

    let imageUrl = null; // Default to null if no image provided

    // Only upload the image to cloudinary if it exists in the request
    if (image) {
       try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          imageUrl = uploadResponse.secure_url;
       } catch (uploadError) {
          console.log("Error uploading image to Cloudinary", uploadError);
          // Decide if you want to fail the request or proceed without image
          // For now, let's proceed but log the error
          // return res.status(500).json({ message: "Image upload failed" });
       }
    }

    // save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl, // Use the potentially null imageUrl
      user: req.user._id,
      tags: tags || [],
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book", error);
    // Check for specific Mongoose validation errors if needed
    if (error.name === 'ValidationError') {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error creating book" });
  }
});

// pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
  // example call from react native - frontend
  // Search: /api/books?search=query
  // Filter by tags: /api/books?tags=fiction,thriller
  // Combined: /api/books?search=query&tags=fiction,thriller&page=1&limit=5
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Increased default limit slightly
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";
    // Parse tags, trim whitespace, and filter out empty tags
    const tagsFilter = req.query.tags
       ? req.query.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
       : [];

    // Build the query object
    const query = {};

    if (searchTerm) {
      // Case-insensitive search on title and caption
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { caption: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (tagsFilter.length > 0) {
      // Find books that have ANY of the specified tags (case-insensitive)
      query.tags = { $in: tagsFilter.map(tag => new RegExp(`^${tag}$`, 'i')) };
    }

    const books = await Book.find(query) // Apply the filter query
      .sort({ createdAt: -1 }) // desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    // Get the total count matching the filter for accurate pagination
    const totalBooks = await Book.countDocuments(query);

    // Add purchase link to each book
    const booksWithPurchaseLink = books.map(book => {
      const plainBook = book.toObject(); // Convert Mongoose document to plain object
      const encodedTitle = encodeURIComponent(plainBook.title);
      plainBook.purchaseLink = `https://www.amazon.com/s?k=${encodedTitle}`;
      return plainBook;
    });

    res.send({
      books: booksWithPurchaseLink, // Send the modified array
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
    // delete image from cloduinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if a book title already exists (case-insensitive)
router.get('/check', async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Title query parameter is required' });
  }

  try {
    // Use a case-insensitive regex search
    const existingBook = await Book.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });

    if (existingBook) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking book existence:', error);
    res.status(500).json({ message: 'Server error checking book title' });
  }
});

// Autocomplete suggestions for book titles
router.get('/suggestions', protectRoute, async (req, res) => {
  const query = req.query.q || '';
  const limit = parseInt(req.query.limit) || 5; // Limit suggestions

  if (!query) {
    return res.json([]); // Return empty array if no query
  }

  try {
    // Use regex for partial matching, case-insensitive
    // Use distinct to get unique titles
    const suggestions = await Book.distinct('title', {
      title: { $regex: query, $options: 'i' }
    }).limit(limit);

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching book suggestions:', error);
    res.status(500).json({ message: 'Server error fetching suggestions' });
  }
});

// Edit a book review
router.put("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;
  const { caption, rating, tags } = req.body;
  const userId = req.user._id;

  // Basic validation for editable fields
  if (caption === undefined && rating === undefined && tags === undefined) {
    return res.status(400).json({ message: "Please provide at least one field to update (caption, rating, or tags)." });
  }
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
     return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book review not found." });
    }

    // Authorization: Check if the current user is the owner of the review
    if (book.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to edit this review." });
    }

    // Update fields if they are provided in the request body
    if (caption !== undefined) book.caption = caption;
    if (rating !== undefined) book.rating = rating;
    if (tags !== undefined) {
        // Ensure tags is an array of strings
        book.tags = Array.isArray(tags) ? tags.map(String) : [];
    }

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book review:", error);
    if (error.name === 'CastError') { // Handle invalid ID format
        return res.status(400).json({ message: 'Invalid review ID format.' });
    }
    res.status(500).json({ message: "Server error updating review." });
  }
});

export default router;
