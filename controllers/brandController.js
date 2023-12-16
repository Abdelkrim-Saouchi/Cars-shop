const asyncHandler = require("express-async-handler");
const Brand = require("../models/brand");
const Car = require("../models/car");

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
