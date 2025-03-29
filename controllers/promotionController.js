// controllers/promotionController.js

const Promotion = require('../models/Promotion');

// GET /admin/promotions
const getPromotionList = async (req, res) => {
  const { name } = req.query;
  let query = {};
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  try {
    const promotions = await Promotion.find(query);
    res.json({ promotions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/promotions/:id
const getPromotionDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ promotion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /admin/promotions
const createPromotion = async (req, res) => {
  const { name, description, discountPercentage, startDate, endDate, image, status } = req.body;
  try {
    const newPromotion = new Promotion({
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      image,
      status,
    });
    await newPromotion.save();
    res.status(201).json({ message: 'Promotion created successfully', promotion: newPromotion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /admin/promotions/:id
const updatePromotion = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const promotion = await Promotion.findByIdAndUpdate(id, updates, { new: true });
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion updated successfully', promotion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /admin/promotions/:id
const deletePromotion = async (req, res) => {
  const { id } = req.params;
  try {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPromotionList,
  getPromotionDetail,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
