const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

exports.categoryList = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}).exec();
  res.render("category_list", {
    title: "Categories",
    categories: allCategories,
  });
});
