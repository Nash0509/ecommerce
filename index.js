const express = require("express");
const mongoose = require("mongoose");
const app = express();
const models = require("./model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const joi = require("joi");
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51QN7PwFddwuYFaDh5huZSurPXsvs4SY9glJrbKLigHQ6gYClipt2sO3PiGBtKX7KlN0pLaeIHx1zqaGroE3lodp100OoqAEYCq"
);

const domain = "http://localhost:5173";

const jwtSecret = "secret";

app.use(cors());
app.use(bodyParser.json());

function authenticateToken(req, res, next) {
  const token = req.header("auth");

  if (!token) return res.status(401).send("Access denied.");

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");

    req.user = user;
    next();
  });
}

const joiSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  phone: joi
    .string()
    .pattern(/^\d{10}$/)
    .required(),
  DOB: joi.date().iso().required(),
  residence: joi.string().min(3).required(),
  userName: joi.string(),
});

mongoose
  .connect(process.env.string)
  .then(() => {
    console.log("The app is connected to the database...");
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });

app.get("/electronics", async (req, res) => {
  try {
    const typesArray = ["elect", "Electronics"];
    const result = await models.electronics.find({ type: { $in: typesArray } });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/clothing", async (req, res) => {
  try {
    const types = ["cloth", "Clothing"];
    const result = await models.electronics.find({ type: { $in: types } });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }
    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/luxury", async (req, res) => {
  try {
    const types = ["lux", "Luxury"];
    const result = await models.electronics.find({ type: { $in: types } });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/sports", async (req, res) => {
  try {
    const types = ["sport", "sports"];
    const result = await models.electronics.find({ type: { $in: types } });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/travel", async (req, res) => {
  try {
    const result = await models.electronics.find({ type: "travel" });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/grocery", async (req, res) => {
  try {
    const result = await models.electronics.find({ type: "grocery" });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/twowheelers", async (req, res) => {
  try {
    const result = await models.electronics.find({ type: "two" });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});
app.get("/home", async (req, res) => {
  try {
    const result = await models.electronics.find({ type: "home" });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

app.get("/product/:id", async (req, res) => {
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
});

app.post("/pdt/:id/:price", async (req, res) => {
  try {
    const result = await models.electronics.create({
      id: req.params.id,
      name: "cart",
      price: req.params.price,
      uid: req.body.uid,
    });

    if (!result) {
      return res.status(404).json({
        message: "An error occured while adding the item to the cart...",
        success: false,
      });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/cart/:uid", async (req, res) => {
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
});

app.post("/register", async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      DOB: req.body.DOB,
      residence: req.body.residence,
      userName: req.body.userName,
    };

    let checkEmail = await models.electronics.find({ email: user.email });

    if (checkEmail.length > 0) {
      return res.status(409).json({ message: "The email already exists..." });
    }

    const validate = joiSchema.validate(user);
    if (validate.error) {
      return res
        .status(422)
        .json({ message: validate.error.details[0].message });
    }

    const result = await models.electronics.create(user);

    if (!result) {
      return res.status(400).send({ message: "Email already in use..." });
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await models.electronics.findOne(user);
    if (!result) {
      return res.status(404).send({ message: "404 not found!" });
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
    return res.status(200).json({ token, result });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/checkout", authenticateToken, (req, res) => {
  return res.status(200).json({ message: true });
});

app.delete("/deleteItem/:id", async (req, res) => {
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
});

app.post("/review/:id", async (req, res) => {
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
});

app.get("/reviews/:id", async (req, res) => {
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
});

app.get("/profile/:id", async (req, res) => {
  try {
    const result = await models.electronics.find({ _id: req.params.id });
    if (!result) {
      return res
        .status(404)
        .json({ message: "No such profile exists with that email..." });
    }
    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
});

app.post("/addToCart/:uid", async (req, res) => {
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
});

app.post("/trendSetter/:pdtId", async (req, res) => {
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
});

app.get("/getTrends", async (req, res) => {
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
});

app.post("/addPdt", async (req, res) => {
  try {
    const product = {
      name: req.body.name,
      dis: req.body.dis,
      rating: 0,
      Price: req.body.price,
      image: req.body.image,
      type: req.body.type,
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
});

app.delete("/deletePdt/:id", async (req, res) => {
  try {
    console.log("Came here");

    const result = await models.electronics.deleteOne({ _id: req.params.id });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }

    return res.status(200).json({ result, success: true });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Internal server error..." });
  }
});

app.patch("/patchPdt/:id", async (req, res) => {
  try {
    console.log(req.body);
    const result = await models.electronics.updateOne(
      {
        _id: req.params.id,
      },
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
    console.log(result);
    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
});

app.get("/categories", async (req, res) => {
  try {
    console.log("Coming inside of the try...");
    const result = await models.electronics.findOne({
      _id: "673737c94facf9242d49e794",
    });
    console.log("Coming inside of the try...1");
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }
    return res.status(200).json({ cate: result.cate, success: true });
  } catch (err) {
    console.log("Coming here...");
    return res.status(500).json({ message: "Internal server error..." });
  }
});

app.put("/addType", async (req, res) => {
  try {
    const result = await models.electronics.updateOne(
      { _id: "673737c94facf9242d49e794" },
      {
        $push: { cate: req.body.categoryName },
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
});

app.patch("/editProfile/:id", async (req, res) => {
  try {
    const result = await models.electronics.updateOne(
      { _id: req.params.id },
      {
        phone: req.body.phone,
        residence: req.body.address,
        userName: req.body.name,
        DOB: req.body.DOB,
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
});

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1QN88FFddwuYFaDhgaC7lF2t",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${domain}/success`,
    cancel_url: `${domain}/cancel`,
  });

  return res.status(200).json({ url: session.url, success: true });
});

app.patch("/updateUserPurchaseStatus/:id", async (req, res) => {
  try {
    console.log(req.body);
    const pdts = req.body.map((pdt) => {
      return {
        id: pdt.id,
        status: "Order Placed",
        date: new Date(),
        price: pdt.price,
      };
    });

    const result = await models.electronics.updateOne(
      { _id: req.params.id },
      {
        $push: { cart:  { $each: pdts } },
      }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }
    return res.status(200).json({ result, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error..." });
  }
});

app.listen(8000, () => {
  console.log("The server is running at the port 3000");
});
