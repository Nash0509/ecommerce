const express = require("express");
const router = express.Router();
const trendsController = require("../Controllers/trends.controller");

router.post("/trendSetter/:pdtId", trendsController.setTrends);
router.get("/getTrends", trendsController.getTrends);

module.exports = router;
