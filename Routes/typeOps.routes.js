const express = require("express");
const router = express.Router();
const typeOpsController = require("../Controllers/typeOps.controller");

router.put("/addType", typeOpsController);

module.exports = router;
