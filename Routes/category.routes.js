// routes/category.routes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/category.controller');

// Get category by name
router.get('/:name', categoryController.getCategoryByName);

// Get all categories
router.get('/', categoryController.getAllCategories);

module.exports = router;
