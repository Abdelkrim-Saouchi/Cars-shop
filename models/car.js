const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

// Url TODO

module.exports = mongoose.model("Car", CarSchema);
