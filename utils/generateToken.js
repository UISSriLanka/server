const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    return token;
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};

module.exports = generateToken;
