const News = require('./models/News');

// Get news list with pagination and filtering
const getNewsList = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'publicationDate', filter = '' } = req.query;

    try {
        // Search query if filter (e.g., title contains the search term)
        const searchQuery = filter ? { title: { $regex: filter, $options: 'i' } } : {};

        const newsArticles = await News.find(searchQuery)
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ [sortBy]: -1 });  // Sort by publicationDate or other field

        res.json({
            news: newsArticles.map(article => ({
                title: article.title,
                description: article.description,
                publicationDate: article.publicationDate,
                image: article.image,
                author: article.author,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching news list' });
    }
};

// Get news details by newsId
const getNewsDetails = async (req, res) => {
    const { newsId } = req.params;

    try {
        const newsArticle = await News.findById(newsId);

        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json({
            news: {
                title: newsArticle.title,
                description: newsArticle.description,
                content: newsArticle.content,
                publicationDate: newsArticle.publicationDate,
                image: newsArticle.image,
                author: newsArticle.author,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching news details' });
    }
};


module.exports = {
    getNewsList,
    getNewsDetails
}