const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: process.env.ADMIN_EMAIL,
    },
    password: {
      type: String,
      default: process.env.ADMIN_PASSWORD,
    },
    role: {
      type: String,
      default: process.env.ADMIN_ROLE,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Admin = new mongoose.model("Admin", adminSchema);

module.exports = Admin;
