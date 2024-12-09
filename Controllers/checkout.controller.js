// controllers/checkout.controller.js

const models = require("../Database/model");
const stripe = require("stripe")(
  "sk_test_51QN7PwFddwuYFaDh5huZSurPXsvs4SY9glJrbKLigHQ6gYClipt2sO3PiGBtKX7KlN0pLaeIHx1zqaGroE3lodp100OoqAEYCq"
);
const domain = "http://localhost:5173";

// Get checkout page (authentication required)
const getCheckoutPage = (req, res) => {
  return res.status(200).json({ message: true });
};

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    let checkOutItems = await Promise.all(
      req.body.map(async (item) => {
        const id = item.id;
        const result = await models.electronics.findById(id);
        if (!result) {
          return res.status(404).send({ message: "Not found!" });
        }

        return {
          price_data: {
            currency: "inr",
            unit_amount: result.Price * 100,
            product_data: {
              name: result.name,
              description: result.dis,
              images: [`${result.image}`],
            },
          },
          quantity: 1,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: checkOutItems,
      mode: "payment",
      success_url: `${domain}/success`,
      cancel_url: `${domain}/cancel`,
    });

    return res.status(200).json({ url: session.url, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update user purchase status
const updateUserPurchaseStatus = async (req, res) => {
  try {
    const pdts = req.body.map((pdt) => {
      return {
        id: pdt.id,
        status: "Order Placed",
        date: new Date(),
        price: pdt.Price,
      };
    });

    const result = await models.electronics.updateOne(
      { _id: req.params.id },
      {
        $push: { cart: { $each: pdts } },
      }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }

    return res.status(200).json({ result, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error..." });
  }
};

module.exports = {
  getCheckoutPage,
  createCheckoutSession,
  updateUserPurchaseStatus,
};
