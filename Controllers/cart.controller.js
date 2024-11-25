// controllers/cart.controller.js

const models = require("../Database/model");

// Get cart details by UID
const getCartByUser = async (req, res) => {
  try {
    const result = await models.electronics.find({
      uid: req.params.uid,
    });

    if (!result) {
      return res.status(404).send({ message: "404 not found!" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Add item to cart by UID
const addToCart = async (req, res) => {
  try {
    const { uid } = req.params; // Extracting uid from params
    const { cartItem } = req.body; // Accessing cart item from the request body

    const result = await models.electronics.updateOne(
      { _id: uid },
      {
        $push: { cart: cartItem },
      }
    );

    if (!result.matchedCount) {
      return res
        .status(404)
        .json({ message: "No document with this id found...", success: false });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
};

module.exports = { getCartByUser, addToCart };
