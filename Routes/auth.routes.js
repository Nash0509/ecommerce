const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller");

// Register a new user
router.post("/register", authController.registerUser);

// Login a user
router.post("/login", authController.loginUser);

// Get user profile
router.get("/profile/:id", authController.getProfile);

// Edit user profile
router.patch("/editProfile/:id", authController.editProfile);

module.exports = router;
