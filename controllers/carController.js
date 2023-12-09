const asyncHandler = require("express-async-handler");
const Car = require("../models/car");

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
