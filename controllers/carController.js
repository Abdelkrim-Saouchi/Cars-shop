const asyncHandler = require("express-async-handler");
const Car = require("../models/car");

// Display list of all cars
exports.carsList = asyncHandler(async (req, res) => {
  const allCars = await Car.find({}, "name price").exec();
  res.render("cars_list", {
    title: "Cars",
    cars: allCars,
  });
});

// Display details of specific car
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
