const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    reviewCreate,
    reviewUpdate,
    getProfile,
    updateProfile,
    getUserPoints,
    getPointHistory,
    getPointTransactionDetails,
    purchasePoints,
} = require('../controllers/userController');
const purchaseController = require('../controllers/purchaseController');
const { getGameList, getGameDetails } = require('../controllers/gamesController');
const { getCardList, getCardDetails } = require('../controllers/cardController');
const { getNewsList, getNewsDetails } = require('../controllers/newsController');
const { getPromotionList, getPromotionDetails } = require('../controllers/promotionController');
const { authenticateToken } = require('../middleware/auth');

// User Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/points', authenticateToken, getUserPoints);
router.get('/point-history', authenticateToken, getPointHistory);
router.get('/point-history/:transactionId', authenticateToken, getPointTransactionDetails);
router.post('/purchase-points', authenticateToken, purchasePoints);
router.post('/topup', purchaseController.topUpAccount);
router.get('/topup/history', purchaseController.getTopUpHistory);
router.get('/topup/history/:topUpId', purchaseController.getTopUpDetails);
router.post('/topup/:topUpId/proof', upload.single('proof'), purchaseController.sendProofOfPayment);


router.post('/payment', purchaseController.generateQRCode);
router.get('/download-receipt/:transactionId', purchaseController.generateReceipt);
router.post('/reviews', reviewCreate);
router.put('/reviews/:reviewId', reviewUpdate);


router.get('/games', getGameList);
router.get('/games/:gameId', getGameDetails);
router.get('/cards', getCardList);
router.get('/cards/:cardId', getCardDetails);
router.get('/promotions', getPromotionList);
router.get('/promotions/:promotionsId', getPromotionDetails);
router.get('/news', getNewsList);
router.get('/news/:newsId', getNewsDetails);


module.exports = router;
