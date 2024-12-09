const models = require("../Database/model");

const setTrends = async (req, res) => {
  try {
    const result = await models.electronics.updateOne(
      { _id: req.params.pdtId },
      { $inc: { watchCount: 1 } } // Corrected $inc usage
    );

    if (result.matchedCount === 0) {
      // Check if the product was found
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
};

const getTrends = async (req, res) => {
  try {
    const result = await models.electronics
      .find({
        watchCount: { $gt: 0 },
      })
      .sort({ watchCount: -1 });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }

    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
};

module.exports = {
  setTrends,
  getTrends,
};
