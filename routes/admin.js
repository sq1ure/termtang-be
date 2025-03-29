// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Import admin auth controllers
const { adminLogin, adminLogout } = require('../controllers/adminAuthController');

// Import controllers for Games Management
const { getGameList, getGameDetail, createGame, updateGame, deleteGame } = require('../controllers/gamesController');

// Import controllers for Card Management
const { getCardList, getCardDetail, createCard, updateCard, deleteCard } = require('../controllers/cardController');

// Import controllers for Transactions Management
const { getTransactionList, getTransactionDetail, confirmTransaction, rejectTransaction } = require('../controllers/transactionController');

// Import controllers for User Management
const { getUserList, getUserDetail, updateUserStatus } = require('../controllers/adminUserController');

// Import controllers for Promotions Management
const { getPromotionList, getPromotionDetail, createPromotion, updatePromotion, deletePromotion } = require('../controllers/promotionController');

// Import controllers for News Management
const { getNewsList, getNewsDetail, createNews, updateNews, deleteNews } = require('../controllers/newsController');

// Import middleware
const { authenticateToken, admin } = require('../middleware/auth');

// Admin authentication endpoints
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Games Management Routes
router.get('/games', authenticateToken, admin, getGameList);
router.get('/games/:id', authenticateToken, admin, getGameDetail);
router.post('/games', authenticateToken, admin, createGame);
router.put('/games/:id', authenticateToken, admin, updateGame);
router.delete('/games/:id', authenticateToken, admin, deleteGame);

// Card Management Routes
router.get('/cards', authenticateToken, admin, getCardList);
router.get('/cards/:id', authenticateToken, admin, getCardDetail);
router.post('/cards', authenticateToken, admin, createCard);
router.put('/cards/:id', authenticateToken, admin, updateCard);
router.delete('/cards/:id', authenticateToken, admin, deleteCard);

// Transactions Management Routes
router.get('/transactions', authenticateToken, admin, getTransactionList);
router.get('/transactions/:id', authenticateToken, admin, getTransactionDetail);
router.put('/transactions/:id/confirm', authenticateToken, admin, confirmTransaction);
router.put('/transactions/:id/reject', authenticateToken, admin, rejectTransaction);

// User Management Routes
router.get('/users', authenticateToken, admin, getUserList);
router.get('/users/:id', authenticateToken, admin, getUserDetail);
router.put('/users/:id/status', authenticateToken, admin, updateUserStatus);

// Promotions Management Routes
router.get('/promotions', authenticateToken, admin, getPromotionList);
router.get('/promotions/:id', authenticateToken, admin, getPromotionDetail);
router.post('/promotions', authenticateToken, admin, createPromotion);
router.put('/promotions/:id', authenticateToken, admin, updatePromotion);
router.delete('/promotions/:id', authenticateToken, admin, deletePromotion);

// News Management Routes
router.get('/news', authenticateToken, admin, getNewsList);
router.get('/news/:id', authenticateToken, admin, getNewsDetail);
router.post('/news', authenticateToken, admin, createNews);
router.put('/news/:id', authenticateToken, admin, updateNews);
router.delete('/news/:id', authenticateToken, admin, deleteNews);

module.exports = router;
