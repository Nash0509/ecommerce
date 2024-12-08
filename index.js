const express = require("express");
const mongoose = require("mongoose");
const app = express();
const models = require("./Database/model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const joi = require("joi");
require("dotenv").config();
const stripe = require("stripe")(process.env.stripe);
const { makeConnection } = require("./Database/connect");
const authRoutes = require("./Routes/auth.routes");
const productRoutes = require("./Routes/products.routes");
const homeRoute = require("./Routes/home.routes");
const cartRoute = require("./Routes/cart.routes");
const categoryRoute = require("./Routes/category.routes");
const productOpsRoute = require("./Routes/pdtOps.routes");
const reviewRoutes = require("./Routes/reviews.routes");
const trendsRoutes = require("./Routes/trends.routes");
const typeOps = require("./Routes/typeOps.routes");
const checkoutRoutes = require('./Routes/checkout.routes');
const domain = process.env.FEDomain;
const jwtSecret = process.env.secret;

// Cors and the json parser
app.use(cors());
app.use(bodyParser.json());

// For making the connection with the MongoDB(dataBase)
makeConnection();

// Start Backend
app.listen(8000, () => {
  console.log("The server is running at the port 8000");
});

//authRoutes
app.use("/api/v1/auth", authRoutes);

//product routes
app.use("/api/v1/product", productRoutes);

//home route
app.use("/api/v1/home", homeRoute);

// Cart Routes
app.use("/api/v1/cart", cartRoute);

// Category Routes
app.use("/api/v1/category", categoryRoute);

// Product Routes
app.use("/api/v1/products", productOpsRoute);

// Reviews Routes
app.use("/api/v1/reviews", reviewRoutes);

// Trends Routes
app.use("/api/v1/trends", trendsRoutes);

// Types ops
app.use("/api/v1/typeOps", typeOps);

// Checkout/done
app.use("/api/v1/checkout", checkoutRoutes);

// Token/done
function authenticateToken(req, res, next) {
  const token = req.header("auth");

  if (!token) return res.status(401).send("Access denied.");

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");

    req.user = user;
    next();
  });
}

// Validation
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

// Auth/done
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

// Products/done
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
      Price: req.params.price,
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

// Home/done
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

// Cart/done
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

// Category/done
app.get("/category/:name", async (req, res) => {
  try {
    const result = await models.electronics.find({
      type: req.params.name,
    });

    if (!result) {
      return res.status(404).send({ message: "404 not found!" });
    }

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});
app.get("/categories", async (req, res) => {
  try {
    const result = await models.electronics.findOne({
      _id: "673737c94facf9242d49e794",
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
});

// Checkout/done
app.get("/checkout", authenticateToken, (req, res) => {
  return res.status(200).json({ message: true });
});
app.post("/create-checkout-session", async (req, res) => {
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
});
app.patch("/updateUserPurchaseStatus/:id", async (req, res) => {
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
    return res.status(500).json({ message: "Internal server error..." });
  }
});

// Pdt Operations/done
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
});
app.patch("/patchPdt/:id", async (req, res) => {
  try {
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
    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error..." });
  }
});

// Reviews/done
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

// Trends/done
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

// Type Op/done
app.put("/addType", async (req, res) => {
  try {
    const result = await models.electronics.updateOne(
      { _id: "673737c94facf9242d49e794" },
      {
        $push: { cate: req.body.categoryName.toLowerCase() },
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
