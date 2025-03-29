// controllers/gameController.js
const Game = require('../models/Game');

// List games with filters: name, category, status
const getGameList = async (req, res) => {
  const { name, category, status } = req.query;
  let query = {};
  if (name) query.gameName = { $regex: name, $options: 'i' };
  if (category) query.category = category;
  if (status) query.gameStatus = status;

  try {
    const games = await Game.find(query);
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single game's detail
const getGameDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new game
const createGame = async (req, res) => {
  const { gameName, gameImage, gameInfo, ratePrices, gameStatus, category, discount } = req.body;
  try {
    const newGame = new Game({
      gameName,
      gameImage,
      gameInfo,
      ratePrices,
      gameStatus,
      category,
      discount,
    });
    await newGame.save();
    res.status(201).json({ message: 'Game created successfully', game: newGame });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing game
const updateGame = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const game = await Game.findByIdAndUpdate(id, updates, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game updated successfully', game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a game
const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getGameList,
  getGameDetail,
  createGame,
  updateGame,
  deleteGame,
};
