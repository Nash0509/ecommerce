const express = require("express");
const router = express.Router();
const productController = require("../Controllers/products.contoller");

// Route handlers for different product categories
router.get("/electronics", (req, res) =>
  productController.getProductsByType(req, res, ["elect", "Electronics"])
);
router.get("/clothing", (req, res) =>
  productController.getProductsByType(req, res, ["cloth", "Clothing"])
);
router.get("/luxury", (req, res) =>
  productController.getProductsByType(req, res, ["lux", "Luxury"])
);
router.get("/sports", (req, res) =>
  productController.getProductsByType(req, res, ["sport", "sports"])
);
router.get("/travel", (req, res) =>
  productController.getProductsByType(req, res, ["travel"])
);
router.get("/grocery", (req, res) =>
  productController.getProductsByType(req, res, ["grocery"])
);
router.get("/twowheelers", (req, res) =>
  productController.getProductsByType(req, res, ["two"])
);

// Fetch a single product by ID
router.get("/product/:id", productController.getProductById);

// Add a product to the cart
router.post("/pdt/:id/:price", productController.addProductToCart);

module.exports = router;
