const asyncHandler = require("express-async-handler");
const Brand = require("../models/brand");

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

  // await Car.find({ brand: req.params.id }, "name").exec(),

  res.render("brand_details", {
    title: "Brand Details:",
    brand: brand,
    // cars: allCars,
  });
});
