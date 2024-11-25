// routes/cart.routes.js

const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cart.controller');

// Get cart by user UID
router.get('/:uid', cartController.getCartByUser);

// Add to cart by user UID
router.post('/addToCart/:uid', cartController.addToCart);

module.exports = router;
