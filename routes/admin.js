const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin } = require('../controllers/adminController');

// Admin Routes
router.post('/login', loginAdmin);
router.get('/logout', logoutAdmin);
// app.put('/purchase-points/:transactionId/review', authenticateAdmin, adminReviewPurchase);

module.exports = router;
