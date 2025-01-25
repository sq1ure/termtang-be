const Game = require('./models/Game');

// Get game list with pagination
const getGameList = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Default to page 1 and limit 10

    try {
        const games = await Game.find()
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ releaseDate: -1 });  // Sort by release date (most recent first)

        res.json({
            games: games.map(game => ({
                name: game.name,
                description: game.description,
                genre: game.genre,
                releaseDate: game.releaseDate,
                platform: game.platform,
                image: game.image,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching game list' });
    }
};

// Get game details by gameId
const getGameDetails = async (req, res) => {
    const { gameId } = req.params;
  
    try {
      const game = await Game.findById(gameId);
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
  
      res.json({
        game: {
          name: game.name,
          description: game.description,
          genre: game.genre,
          releaseDate: game.releaseDate,
          platform: game.platform,
          image: game.image,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching game details' });
    }
  };
  

module.exports = {
    getGameList,
    getGameDetails,
}