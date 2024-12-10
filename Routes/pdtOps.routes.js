// routes/product.routes.js

const express = require("express");
const router = express.Router();
const productController = require("../Controllers/pdtOps.controller");

// Delete a product
router.delete("/deleteItem/:id", productController.deleteProduct);

// Add a new product
router.post("/addPdt", productController.addProduct);

// Delete a product by ID (same functionality as deleteItem)
router.delete("/deletePdt/:id", productController.deletePdt);

// Update a product
router.patch("/patchPdt/:id", productController.updateProduct);

module.exports = router;
