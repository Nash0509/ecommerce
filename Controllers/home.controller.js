const models = require("../Database/model");

const home = async (req, res) => {
  try {
    const result = await models.electronics.find({ type: "home" });

    if (!result || result.length === 0) {
      return res.status(404).send({ message: "Not found!" });
    }

    res.json(result);
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

module.exports = {
  home,
};
