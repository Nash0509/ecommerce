const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  dis: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  id: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  review: {
    type: String,
  },
  phone: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  residence: {
    type: String,
  },
  cart : {
    type : Array
  },
  userName : {
    type : String
  }, 
  uid : {
    type : String
  },
  watchCount: {
    type : Number
  },
  image : {
    type : String
  },
  type : {
    type : String
  },
  categories : {
    type : Array
  }
});

const electronics = mongoose.model("electronics", schema);

module.exports = {
  electronics,
};
