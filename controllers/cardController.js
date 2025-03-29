// controllers/cardController.js
const Card = require('../models/Card');

// Get list of cards with optional filters (name, status)
const getCardList = async (req, res) => {
  const { name, status } = req.query;
  let query = {};
  if (name) query.cardName = { $regex: name, $options: 'i' };
  if (status) query.status = status;
  try {
    const cards = await Card.find(query);
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get card detail by id
const getCardDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new card
const createCard = async (req, res) => {
  const { cardName, prices, cardImage, cardInfo, status } = req.body;
  try {
    const newCard = new Card({
      cardName,
      prices,
      cardImage,
      cardInfo,
      status,
    });
    await newCard.save();
    res.status(201).json({ message: 'Card created successfully', card: newCard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing card
const updateCard = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const card = await Card.findByIdAndUpdate(id, updates, { new: true });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card updated successfully', card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a card
const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByIdAndDelete(id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCardList,
  getCardDetail,
  createCard,
  updateCard,
  deleteCard,
};
