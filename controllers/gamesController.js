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
  // Extract fields from req.body
  const { gameName, gameInfo, ratePrices, gameStatus, category, discount } = req.body;
  // Use req.file if provided for the game image; otherwise, fallback to any gameImage passed in req.body or a default value
  const gameImage = req.file ? req.file.path : req.body.gameImage || "";
  
  // Attempt to parse ratePrices (if sent as a JSON string from the client)
  let parsedRatePrices;
  try {
    parsedRatePrices = JSON.parse(ratePrices);
  } catch (e) {
    // If parsing fails, assume it's already an array
    parsedRatePrices = ratePrices;
  }

  try {
    const newGame = new Game({
      gameName,
      gameImage,
      gameInfo,
      ratePrices: parsedRatePrices,
      gameStatus: gameStatus.toLowerCase(), // Ensure status is lowercase
      category,
      discount,
    });
    await newGame.save();
    res.status(201).json({ message: "Game created successfully", game: newGame });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing game
const updateGame = async (req, res) => {
  const { id } = req.params;
  // Make a copy of the request body to modify
  let updates = { ...req.body };

  // If a new file is uploaded, use its path as the game image
  if (req.file) {
    updates.gameImage = req.file.path;
  }
  
  // If ratePrices is provided, try to parse it (if sent as a JSON string) or leave it if it's already an array
  if (updates.ratePrices) {
    try {
      // If ratePrices is a string (from FormData), try parsing it
      updates.ratePrices = JSON.parse(updates.ratePrices);
    } catch (e) {
      // Otherwise, assume it's already in the correct format (array)
    }
  }

  // Ensure gameStatus is lowercase to match your schema enum (e.g., "active" or "inactive")
  if (updates.gameStatus) {
    updates.gameStatus = updates.gameStatus.toLowerCase();
  }

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
