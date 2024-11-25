// controllers/category.controller.js

const models = require("../Database/model");

// Get category by name
const getCategoryByName = async (req, res) => {
  try {
    const result = await models.electronics.find({
      type: req.params.name,
    });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "404 not found!" });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await models.electronics.findOne({
      _id: "673737c94facf9242d49e794", // Adjust the _id as needed
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }

    return res.status(200).json({ cate: result.cate, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
};

module.exports = { getCategoryByName, getAllCategories };
