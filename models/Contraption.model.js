const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("./User.model");

const contraptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 250,
    },
    quantity: {
      type: Number,
    },
    done: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contraption = model("Contraption", contraptionSchema);

module.exports = Contraption;

//¿HACE FALTA AQUI EL USER?
// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;
// const Character = require("./Character.model");

// const contraptionSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       maxLength: 250,
//     },
//     quantity: {
//       type: Number,
//     },

//     done: {
//       type: Boolean,
//       default: false,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Contraption = model("Contraption", contraptionSchema);

// module.exports = Contraption;
