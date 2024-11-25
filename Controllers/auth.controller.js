const models = require("../Database/model");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

// Validation schema
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

// Register a new user
const registerUser = async (req, res) => {
  try {
    const user = req.body;

    const checkEmail = await models.electronics.find({ email: user.email });
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
      return res.status(400).send({ message: "Failed to create user..." });
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await models.electronics.findOne({ email, password });
    if (!result) {
      return res.status(404).send({ message: "Invalid email or password!" });
    }

    const token = jwt.sign({ email, password }, jwtSecret, { expiresIn: "1h" });
    return res.status(200).json({ token, result });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const result = await models.electronics.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Profile not found!" });
    }
    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Edit user profile
const editProfile = async (req, res) => {
  try {
    const updateData = {
      phone: req.body.phone,
      residence: req.body.address,
      userName: req.body.name,
      DOB: req.body.DOB,
    };

    const result = await models.electronics.updateOne(
      { _id: req.params.id },
      updateData
    );
    if (!result.modifiedCount) {
      return res
        .status(404)
        .json({ success: false, message: "No document found..." });
    }
    return res.status(200).json({ result, success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  editProfile,
};
