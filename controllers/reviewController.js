const Review = require('../models/Review');

// Create a new review (requires authentication)
const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    if (!rating && !reviewText) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Use req.user._id as the userId (set by authenticateToken middleware)
    const review = new Review({
      userId: req.user._id,
      rating,
      reviewText,
    });
    await review.save();
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};

    if (userId) {
      query.userId = userId;
    }
    const reviews = await Review.find(query).populate("userId", "username email");
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update an existing review (only the owner can update)
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, reviewText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if the authenticated user is the owner of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own review.' });
    }

    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText;

    await review.save();
    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviews, updateReview };
