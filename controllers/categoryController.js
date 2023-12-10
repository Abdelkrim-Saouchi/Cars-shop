const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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

// Get request to display create category form
exports.categoryCreateGet = asyncHandler(async (req, res) => {
  res.render("category_form", {
    title: "Create Category",
  });
});

// Post request to create category
exports.categoryCreatePost = [
  // validate and sanitize fields
  body("name", "Category name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // process data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Get request to display update category form
exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category == null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update category",
    category: category,
  });
});

// Post request to update category
exports.categoryUpdatePost = [
  // Validate and sanitize fields
  body("name", "Category name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Category description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process data
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
