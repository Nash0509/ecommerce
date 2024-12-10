const models = require("../Database/model");

const postReviews = async (req, res) => {
  try {
    const result = await models.electronics.create({
      review: req.body.review,
      id: req.params.id,
      name: "review",
      rating: req.body.rating,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const result = await models.electronics.find({
      name: "review",
      id: req.params.id,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Not found while fetching the reviews" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  postReviews,
  getReviews,
};
