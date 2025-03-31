// routes/user.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getProfile,
    getUserPoints,
    getPointHistory,
    getPointTransactionDetails,
    purchasePoints,
    updateProfile } = require('../controllers/userController');

const upload = require("../middleware/upload");

const { createReview, getReviews, updateReview } = require('../controllers/reviewController');
const { getPromotionList, getPromotionDetail } = require('../controllers/promotionController');
const { getGameList, getGameDetail } = require('../controllers/gamesController');
const { getCardList, getCardDetail } = require('../controllers/cardController');
const { getNewsList, getNewsDetail } = require('../controllers/newsController');
const purchaseController = require('../controllers/purchaseController');

const { authenticateToken } = require('../middleware/auth');

// Client Authentication Endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// review
router.post('/review/create', authenticateToken, createReview);
router.get('/review', getReviews);
router.put('/review/:id', authenticateToken, updateReview);

// promotions
router.get('/promotions', getPromotionList);
router.get('/promotions/:id', getPromotionDetail);
// games
router.get('/games', getGameList);
router.get('/games/:id', getGameDetail);

// card
router.get('/cards', getCardList);
router.get('/cards/:id', getCardDetail);

// news
router.get('/news', getNewsList);
router.get('/news/:id', getNewsDetail);

// router.post('/payment', authenticateToken, purchaseController.generateQRCode);
router.post('/payment', purchaseController.generateQRCode);
router.get('/download-receipt/:transactionId', authenticateToken, purchaseController.generateReceipt);

router.get('/points', authenticateToken, getUserPoints);
router.get('/point-history', authenticateToken, getPointHistory);
router.get('/point-history/:transactionId', authenticateToken, getPointTransactionDetails);
router.post('/purchase-points', authenticateToken, purchasePoints);
router.post('/topup', authenticateToken, purchaseController.topUpAccount);
router.get('/topup/history', authenticateToken, purchaseController.getTopUpHistory);
router.get('/topup/history/:topUpId', authenticateToken, purchaseController.getTopUpDetails);
router.post('/topup/:topUpId/proof', upload.single('proof'), authenticateToken, purchaseController.sendProofOfPayment);


module.exports = router;
