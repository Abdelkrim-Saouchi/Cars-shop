const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

// Display list of categories
exports.categoryList = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}).exec();
  res.render("category_list", {
    title: "Categories",
    categories: allCategories,
  });
});

// Get request to display specific category
exports.categoryDetails = asyncHandler(async (req, res) => {
  const selectedCategory = await Category.findById(req.params.id).exec();
  res.render("category_details", {
    title: "Category details",
    category: selectedCategory,
  });
});
