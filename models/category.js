const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// Url of category
CategorySchema.virtual("url").get(function () {
  return `/categories/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
