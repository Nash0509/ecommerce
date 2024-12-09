const models = require("../Database/model");

// Fetch products by type
const getProductsByType = async (req, res, types) => {
  try {
    console.log("Coming here...")
    const result = await models.electronics.find({ type: { $in: types } });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

// Fetch a single product by ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await models.electronics.findById(id);

    if (!result) {
      return res.status(404).send({ message: "Not found!" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Add a product to the cart
const addProductToCart = async (req, res) => {
  try {
    const { id, price } = req.params;
    const { uid } = req.body;

    const result = await models.electronics.create({
      id,
      name: "cart",
      Price: price,
      uid,
    });

    if (!result) {
      return res.status(404).json({
        message: "An error occurred while adding the item to the cart...",
        success: false,
      });
    }

    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getProductsByType,
  getProductById,
  addProductToCart,
};
