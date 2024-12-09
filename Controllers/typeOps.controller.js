const models = require("../Database/model");

const addType = async (req, res) => {
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
};

module.exports = addType;
