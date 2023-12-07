const asyncHandler = require("express-async-handler");
const Brand = require("../models/brand");
const Car = require("../models/car");
const Category = require("../models/category");

// Get the records count form db
exports.index = asyncHandler(async (req, res) => {
  const [brandNum, carNum, categoriesNum] = await Promise.all([
    Brand.countDocuments({}),
    Car.countDocuments({}),
    Category.countDocuments({}),
  ]);

  const recordsCount = {
    Brands: brandNum,
    Cars: carNum,
    Categories: categoriesNum,
  };

  res.render("index", {
    title: "Home page",
    recordsCount: recordsCount,
  });
});
