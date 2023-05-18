const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "https://i.stack.imgur.com/l60Hf.png",
    },
    description: { type: String, default: "No existe descripción." },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
