// controllers/newsController.js
const News = require('../models/News');

// GET /admin/news - List news items with optional filtering by title
const getNewsList = async (req, res) => {
  const { title } = req.query;
  let query = {};
  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }
  try {
    const newsItems = await News.find(query);
    res.json({ news: newsItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/news/:id - Get a specific news item's details
const getNewsDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json({ news: newsItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /admin/news - Create a new news item
const createNews = async (req, res) => {
  const { title, description, content, publicationDate, image, author } = req.body;
  try {
    const newNews = new News({
      title,
      description,
      content,
      publicationDate,
      image,
      author,
    });
    await newNews.save();
    res.status(201).json({ message: 'News item created successfully', news: newNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /admin/news/:id - Update an existing news item
const updateNews = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const newsItem = await News.findByIdAndUpdate(id, updates, { new: true });
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json({ message: 'News item updated successfully', news: newsItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /admin/news/:id - Delete a news item
const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findByIdAndDelete(id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNewsList,
  getNewsDetail,
  createNews,
  updateNews,
  deleteNews,
};
