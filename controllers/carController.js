const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const upload = require("../storage");
const fs = require("fs");
const Car = require("../models/car");
const Brand = require("../models/brand");
const Category = require("../models/category");

// Get request to Display list of all cars
exports.carsList = asyncHandler(async (req, res) => {
  const allCars = await Car.find({}, "name price").exec();
  res.render("cars_list", {
    title: "Cars",
    cars: allCars,
  });
});

// Get request to Display details of specific car
exports.carDetails = asyncHandler(async (req, res) => {
  const selectedCar = await Car.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec();
  res.render("car_details", {
    title: "Car details",
    car: selectedCar,
  });
});

// Get request to display delete specific car form
exports.carDeleteGet = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).exec();
  if (car == null) {
    res.redirect("/cars");
  }

  res.render("delete_car", {
    title: "Delete Car",
    car: car,
  });
});

// Post request to delete specific car
exports.carDeletePost = asyncHandler(async (req, res, next) => {
  // delete old image from the server
  if (req.body.oldPath !== "") {
    fs.unlink("public" + req.body.oldPath, (err) => {
      if (err) next(err);
    });
  }
  // delete car from db
  await Car.findByIdAndDelete(req.body.carId);
  res.redirect("/cars");
});

// Get request to display create car form
exports.carCreateGet = asyncHandler(async (req, res) => {
  const [allBrands, allCategories] = await Promise.all([
    await Brand.find({}, "name").sort({ name: 1 }).exec(),
    await Category.find({}, "name").sort({ name: 1 }).exec(),
  ]);

  res.render("car_form", {
    title: "Create Car",
    brands: allBrands,
    categories: allCategories,
  });
});

// Post request to create car
exports.carCreatePost = [
  // upload image
  upload.single("carImage"),
  // validate and sanitize fields
  body("carName", "Car name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Car description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .isInt({ min: 1 })
    .withMessage("Price must be greater than 0"),
  body("numberInStock", "Stock number must be empty")
    .isInt({ min: 0 })
    .withMessage("Stock must be equal or greater than 0"),
  body("brand", "Brand must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // process data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // handle empty file
    let imgPath;
    console.log("req.file", req.file);
    if (req.file) {
      imgPath = `/uploads/${req.file.filename}`;
    }
    console.log("imgPath:", imgPath);

    const car = new Car({
      brand: req.body.brand,
      name: req.body.carName,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      category: req.body.category,
      imgPath: imgPath,
    });

    if (!errors.isEmpty()) {
      const [allBrands, allCategories] = await Promise.all([
        await Brand.find({}, "name").sort({ name: 1 }).exec(),
        await Category.find({}, "name").sort({ name: 1 }).exec(),
      ]);

      res.render("car_form", {
        title: "Create Car",
        brands: allBrands,
        categories: allCategories,
        car: car,
        errors: errors.array(),
      });
    } else {
      await car.save();
      res.redirect(car.url);
    }
  }),
];

// Get request to display update form
exports.carUpdateGet = asyncHandler(async (req, res, next) => {
  const [allBrands, allCategories, car] = await Promise.all([
    await Brand.find({}, "name").sort({ name: 1 }).exec(),
    await Category.find({}, "name").sort({ name: 1 }).exec(),
    await Car.findById(req.params.id).exec(),
  ]);

  if (car == null) {
    const err = new Error("Car not Found");
    err.status = 404;
    return next(err);
  }

  res.render("car_form", {
    title: "Update Car",
    brands: allBrands,
    categories: allCategories,
    car: car,
  });
});

// Post request to handle car update
exports.carUpdatePost = [
  // upload image
  upload.single("carImage"),
  // validate and sanitize fields
  body("carName", "Car name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Car description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .isInt({ min: 1 })
    .withMessage("Price must be greater than 0"),
  body("numberInStock", "Stock number must be empty")
    .isInt({ min: 0 })
    .withMessage("Stock must be equal or greater than 0"),
  body("brand", "Brand must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process data
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Handle changing image or not
    let car = null;
    console.log("run 1:", req.file);
    if (req.file) {
      // delete old image from server
      if (req.body.oldPath !== "") {
        fs.unlink("public" + req.body.oldPath, (err) => {
          if (err) {
            next(err);
          }
        });
      }
      console.log("run 2");
      // Update car info with new imgPath
      car = new Car({
        brand: req.body.brand,
        name: req.body.carName,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        category: req.body.category,
        imgPath: `/uploads/${req.file.filename}`,
        _id: req.params.id,
      });
    } else {
      // Update car info with old imgPath
      car = new Car({
        brand: req.body.brand,
        name: req.body.carName,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        category: req.body.category,
        imgPath: req.body.oldPath,
        _id: req.params.id,
      });
    }

    if (!errors.isEmpty()) {
      const [allBrands, allCategories] = await Promise.all([
        await Brand.find({}, "name").sort({ name: 1 }).exec(),
        await Category.find({}, "name").sort({ name: 1 }).exec(),
      ]);

      res.render("car_form", {
        title: "Create Car",
        brands: allBrands,
        categories: allCategories,
        car: car,
        errors: errors.array(),
      });
    } else {
      const updatedCar = await Car.findByIdAndUpdate(req.params.id, car, {});
      res.redirect(updatedCar.url);
    }
  }),
];
