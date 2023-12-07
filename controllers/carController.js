const asyncHandler = require("express-async-handler");
const Car = require("../models/car");

exports.carsList = asyncHandler(async (req, res) => {
  const allCars = await Car.find({}, "name price").exec();
  res.render("cars_list", {
    title: "Cars",
    cars: allCars,
  });
});
