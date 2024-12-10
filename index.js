const express = require("express");
const mongoose = require("mongoose");
const app = express();
const models = require("./Database/model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const joi = require("joi");
require("dotenv").config();
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
app.listen(process.env.PORT, () => {
  console.log(`🤖The server is running at the port ${process.env.PORT}`);
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