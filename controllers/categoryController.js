const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Car = require("../models/car");

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

// Get request to display delete form
exports.categoryDeleteGet = asyncHandler(async (req, res) => {
  const [category, cars] = await Promise.all([
    await Category.findById(req.params.id).exec(),
    await Car.find({ category: req.params.id }, "name")
      .sort({ name: 1 })
      .exec(),
  ]);

  if (category == null) {
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    cars: cars,
  });
});

// Post request to handle delete category
exports.categoryDeletePost = asyncHandler(async (req, res) => {
  const [category, cars] = await Promise.all([
    await Category.findById(req.params.id).exec(),
    await Car.find({ category: req.params.id }, "name")
      .sort({ name: 1 })
      .exec(),
  ]);

  if (cars.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      cars: cars,
    });
  } else {
    await Category.findByIdAndDelete(req.body.categoryId);
    res.redirect("/categories");
  }
});
