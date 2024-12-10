const models = require("../Database/model");

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const result = await models.electronics.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Item deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      dis: req.body.dis,
      rating: 0,
      Price: req.body.price,
      image: req.body.image,
      type: req.body.type.toLowerCase(),
      watchCount: 0,
    };

    const result = await models.electronics.create(product);

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

// Delete a product by ID (same as deleteProduct)
const deletePdt = async (req, res) => {
  try {
    const result = await models.electronics.deleteOne({ _id: req.params.id });

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

// Update a product
const updateProduct = async (req, res) => {
  try {
    const result = await models.electronics.updateOne(
      { _id: req.params.id },
      {
        name: req.body.product.name,
        dis: req.body.product.dis,
        Price: req.body.product.Price,
        image: req.body.product.image,
      }
    );

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

module.exports = { deleteProduct, addProduct, deletePdt, updateProduct };
