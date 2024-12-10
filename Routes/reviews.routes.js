const express = require("express");
const router = express.Router();
const reviewController = require("../Controllers/reviews.controller");

router.post("/review/:id", reviewController.postReviews);
router.get("/reviews/:id", reviewController.getReviews);

module.exports = router;
