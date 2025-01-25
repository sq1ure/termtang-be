const Promotion = require('./models/Promotion');

// Get promotions list with pagination and filtering
const getPromotionList = async (req, res) => {
    const { page = 1, limit = 10, status = 'active', sortBy = 'startDate' } = req.query;

    try {
        const promotions = await Promotion.find({ status })
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ [sortBy]: -1 });  // Sort by the provided field (default: startDate)

        res.json({
            promotions: promotions.map(promotion => ({
                name: promotion.name,
                description: promotion.description,
                discountPercentage: promotion.discountPercentage,
                startDate: promotion.startDate,
                endDate: promotion.endDate,
                image: promotion.image,
                status: promotion.status,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching promotions list' });
    }
};

// Get promotion details by promotionId
const getPromotionDetails = async (req, res) => {
    const { promotionId } = req.params;

    try {
        const promotion = await Promotion.findById(promotionId);

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.json({
            promotion: {
                name: promotion.name,
                description: promotion.description,
                discountPercentage: promotion.discountPercentage,
                startDate: promotion.startDate,
                endDate: promotion.endDate,
                image: promotion.image,
                status: promotion.status,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching promotion details' });
    }
};

module.exports = {
    getPromotionList,
    getPromotionDetails
}