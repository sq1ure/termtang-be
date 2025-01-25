const Card = require('./models/Card');

// Get card list with pagination and filtering
const getCardList = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'releaseDate', filter = '' } = req.query;  // Default to page 1, limit 10, sort by releaseDate

    // Build query filter for rarity or other attributes (e.g., by rarity)
    const filterQuery = filter ? { rarity: filter } : {};

    try {
        const cards = await Card.find(filterQuery)
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ [sortBy]: -1 });  // Sort by the provided field (default: releaseDate)

        res.json({
            cards: cards.map(card => ({
                name: card.name,
                description: card.description,
                type: card.type,
                releaseDate: card.releaseDate,
                image: card.image,
                rarity: card.rarity,
                attributes: card.attributes,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching card list' });
    }
};

// Get card details by cardId
const getCardDetails = async (req, res) => {
    const { cardId } = req.params;

    try {
        const card = await Card.findById(cardId);

        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.json({
            card: {
                name: card.name,
                description: card.description,
                type: card.type,
                releaseDate: card.releaseDate,
                image: card.image,
                rarity: card.rarity,
                attributes: card.attributes,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching card details' });
    }
};

module.exports = {
    getCardList,
    getCardDetails
}