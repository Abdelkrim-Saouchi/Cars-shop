const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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
exports.carDeletePost = asyncHandler(async (req, res) => {
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

    const car = new Car({
      brand: req.body.brand,
      name: req.body.carName,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      category: req.body.category,
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
  console.log("car:", car);
  res.render("car_form", {
    title: "Update Car",
    brands: allBrands,
    categories: allCategories,
    car: car,
  });
});
