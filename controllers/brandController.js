const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const upload = require("../storage");
const Brand = require("../models/brand");
const Car = require("../models/car");
const Category = require("../models/category");

// Display list of all brands on Get
exports.brandList = asyncHandler(async (req, res) => {
  const allBrands = await Brand.find({}).populate("category").exec();

  res.render("brand_list", {
    title: "Brands",
    brands: allBrands,
  });
});

// Get request to display specific brand
exports.brandDetails = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id).populate("category").exec();

  res.render("brand_details", {
    title: "Brand Details:",
    brand: brand,
  });
});

// Get request to display delete specific brand form
exports.brandDeleteGet = asyncHandler(async (req, res) => {
  const [brand, cars] = await Promise.all([
    await Brand.findById(req.params.id).exec(),
    await Car.find({ brand: req.params.id }, "name").sort({ name: 1 }).exec(),
  ]);
  if (brand == null) {
    res.redirect("/brands");
  }

  res.render("delete_brand", {
    title: "Delete brand",
    brand: brand,
    cars: cars,
  });
});

// Post request to handle delete brand
exports.brandDeletePost = asyncHandler(async (req, res) => {
  const [brand, cars] = await Promise.all([
    await Brand.findById(req.params.id).exec(),
    await Car.find({ brand: req.params.id }, "name").sort({ name: 1 }).exec(),
  ]);

  if (cars.length > 0) {
    res.render("brand_delete", {
      title: "Delete Brand",
      brand: brand,
      cars: cars,
    });
  } else {
    await Brand.findByIdAndDelete(req.body.brandId);
    res.redirect("/brands");
  }
});

// Get request to display create brand form
exports.brandCreateGet = asyncHandler(async (req, res) => {
  const categories = await Category.find({}, "name").exec();
  res.render("brand_form", {
    title: "Create Brand",
    categories: categories,
  });
});

// Post request to create brand
exports.brandCreatePost = [
  // upload image
  upload.single("image"),

  // handle no checked category
  (req, res, next) => {
    req.body.category =
      typeof req.body.category === "undefined" ? [] : req.body.category;
    next();
  },
  // validate and sanitize fields
  body("name", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Brand description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  // process data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // handle empty file
    let imgPath;
    if (req.file) {
      imgPath = `/uploads/${req.file.filename}`;
    }
    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      imgPath: imgPath,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find({}, "name").exec();
      for (const category of categories) {
        if (brand.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        categories: categories,
        errors: errors.array(),
      });
    } else {
      await brand.save();
      res.redirect(brand.url);
    }
  }),
];

// Get request to display update brand form
exports.brandUpdateGet = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).exec();
  if (brand == null) {
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  const categories = await Category.find({}, "name").exec();
  for (const category of categories) {
    if (brand.category.includes(category._id)) {
      category.checked = "true";
    }
  }
  res.render("brand_form", {
    title: "Update Brand",
    brand: brand,
    categories: categories,
  });
});

// Post request to handle update brand
exports.brandUpdatePost = [
  // upload image
  upload.single("image"),
  // handle no checked category
  (req, res, next) => {
    req.body.category =
      typeof req.body.category === "undefined" ? [] : req.body.category;
    next();
  },
  // validate and sanitize fields
  body("name", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Brand description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),
  // process data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Handle changing image file or not
    let brand = null;
    if (req.file) {
      brand = new Brand({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        imgPath: `/uploads/${req.file.filename}`,
        _id: req.params.id,
      });
    } else {
      brand = new Brand({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        imgPath: req.body.oldPath,
        _id: req.params.id,
      });
    }

    if (!errors.isEmpty()) {
      const categories = await Category.find({}, "name").exec();
      for (const category of categories) {
        if (brand.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        categories: categories,
        errors: errors.array(),
      });
    } else {
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        brand,
        {},
      );
      res.redirect(updatedBrand.url);
    }
  }),
];
