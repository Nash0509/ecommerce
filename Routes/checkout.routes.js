const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middlewares/auth');
const checkoutController = require('../Controllers/checkout.controller');

// Get checkout page (authentication required)
router.get('/', authenticateToken, checkoutController.getCheckoutPage);

// Create checkout session
router.post('/create-checkout-session', checkoutController.createCheckoutSession);

// Update user purchase status
router.patch('/updateUserPurchaseStatus/:id', checkoutController.updateUserPurchaseStatus);

module.exports = router;
