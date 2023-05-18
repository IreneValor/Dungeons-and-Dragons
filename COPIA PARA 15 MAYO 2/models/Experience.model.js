const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  titulo: {
    type: String,
  },
  texto: {
    type: String,
  },
  imagen: {
    type: String,
  },
  filtro: {
    type: [String],
    enum: ["pais", "ciudad", "naturaleza", "ocio", "precio"],
    required: false,
  },
  // GeoJSON: https://www.mongodb.com/docs/manual/reference/geojson/
  location: {
    type: {
      type: String, // Point, Line, Polygon...
    },
    coordinates: [Number], // Lng [-180 to 180]  - Lat [-90 to 90]
  },
});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
