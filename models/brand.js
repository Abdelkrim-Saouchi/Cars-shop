const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

// BrandSchema.virtual('url').get(function() {
//     return `brands/`
// })

module.exports = mongoose.model("Brand", BrandSchema);
