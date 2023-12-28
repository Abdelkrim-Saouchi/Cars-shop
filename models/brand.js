const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  imgPath: String,
  imgUrl: String,
  publicId: String,
});

// Brand's url
BrandSchema.virtual("url").get(function () {
  return `/brands/brand/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
