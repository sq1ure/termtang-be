// const express = require('express');
// const router = express.Router();
// const {
//     registerUser,
//     loginUser,
//     logoutUser,
//     forgotPassword,
//     resetPassword,
//     reviewCreate,
//     reviewUpdate,
//     getProfile,
//     updateProfile,
//     getUserPoints,
//     getPointHistory,
//     getPointTransactionDetails,
//     purchasePoints,
// } = require('../controllers/userController');
// const purchaseController = require('../controllers/purchaseController');
// const { getGameList, getGameDetails } = require('../controllers/gamesController');
// const { getCardList, getCardDetails } = require('../controllers/cardController');
// const { getNewsList, getNewsDetails } = require('../controllers/newsController');
// const { getPromotionList, getPromotionDetails } = require('../controllers/promotionController');
// const { authenticateToken } = require('../middleware/auth');

// // User Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/logout', logoutUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.get('/profile', authenticateToken, getProfile);
// router.put('/profile', authenticateToken, updateProfile);
// router.get('/points', authenticateToken, getUserPoints);
// router.get('/point-history', authenticateToken, getPointHistory);
// router.get('/point-history/:transactionId', authenticateToken, getPointTransactionDetails);
// router.post('/purchase-points', authenticateToken, purchasePoints);
// router.post('/topup', purchaseController.topUpAccount);
// router.get('/topup/history', purchaseController.getTopUpHistory);
// router.get('/topup/history/:topUpId', purchaseController.getTopUpDetails);
// router.post('/topup/:topUpId/proof', upload.single('proof'), purchaseController.sendProofOfPayment);


// router.post('/payment', purchaseController.generateQRCode);
// router.get('/download-receipt/:transactionId', purchaseController.generateReceipt);
// router.post('/reviews', reviewCreate);
// router.put('/reviews/:reviewId', reviewUpdate);


// router.get('/games', getGameList);
// router.get('/games/:gameId', getGameDetails);
// router.get('/cards', getCardList);
// router.get('/cards/:cardId', getCardDetails);
// router.get('/promotions', getPromotionList);
// router.get('/promotions/:promotionsId', getPromotionDetails);
// router.get('/news', getNewsList);
// router.get('/news/:newsId', getNewsDetails);


// module.exports = router;



const express = require('express');
const router = express.Router();

// Import controllers from your controllers folder
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

// Import middleware for authentication and file upload (if needed)
const { authenticateToken } = require('../middleware/auth');
// const upload = require('../middleware/upload'); // Make sure this file exists and exports your multer instance

// User Authentication and Account Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Profile and Points Routes (Protected with authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/points', authenticateToken, getUserPoints);
router.get('/point-history', authenticateToken, getPointHistory);
router.get('/point-history/:transactionId', authenticateToken, getPointTransactionDetails);
router.post('/purchase-points', authenticateToken, purchasePoints);

// Topup Endpoints
router.post('/topup', purchaseController.topUpAccount);
router.get('/topup/history', purchaseController.getTopUpHistory);
router.get('/topup/history/:topUpId', purchaseController.getTopUpDetails);
// router.post('/topup/:topUpId/proof', upload.single('proof'), purchaseController.sendProofOfPayment);

// Payment and Receipt Endpoints
router.post('/payment', purchaseController.generateQRCode);
router.get('/download-receipt/:transactionId', purchaseController.generateReceipt);

// Review Endpoints
router.post('/reviews', reviewCreate);
router.put('/reviews/:reviewId', reviewUpdate);

// Game Endpoints
router.get('/games', getGameList);
router.get('/games/:gameId', getGameDetails);

// Card Endpoints
router.get('/cards', getCardList);
router.get('/cards/:cardId', getCardDetails);

// Promotion Endpoints
router.get('/promotions', getPromotionList);
router.get('/promotions/:promotionsId', getPromotionDetails);

// News Endpoints
router.get('/news', getNewsList);
router.get('/news/:newsId', getNewsDetails);

module.exports = router;
