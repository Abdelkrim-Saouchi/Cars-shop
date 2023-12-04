#! /usr/bin/env node

console.log(
  'This script populates some bands, categories, and cars to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Brand = require("./models/brand");
const Category = require("./models/category");
const Car = require("./models/car");

const brands = [];
const categories = [];
const cars = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createBrands();
  await createCars();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// categories[0] will always be the Sedans, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function brandCreate(index, name, description, category) {
  const brandDetails = {
    name: name,
    description: description,
  };

  if (category !== false) brandDetails.category = category;

  const brand = new Brand(brandDetails);

  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}

async function carCreate(
  index,
  brand,
  name,
  description,
  price,
  numberInStock,
  category,
) {
  const car = new Car({
    brand: brand,
    name: name,
    description: description,
    price: price,
    numberInStock: numberInStock,
    category: category,
  });
  await car.save();
  cars[index] = car;
  console.log(`Added car: ${name}`);
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate(
      0,
      "Alpha Motors",
      "Alpha Motors is synonymous with cutting-edge automotive technology and innovation. Known for producing a diverse range of vehicles, Alpha Motors excels in delivering performance, luxury, and eco-friendly options.",
      categories,
    ),
    brandCreate(
      1,
      "Horizon Motors",
      "Horizon Motors is dedicated to creating reliable and efficient vehicles that cater to a wide range of driving needs. With a focus on innovation and sustainability, Horizon Motors brings a fresh perspective to the automotive industry.",
      categories,
    ),
    brandCreate(
      2,
      "Velocity Auto",
      "Velocity Auto is the epitome of luxury and performance. With a commitment to craftsmanship and state-of-the-art technology, Velocity Auto caters to those who seek the highest standards in both driving experience and design.",
      categories,
    ),
  ]);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Sedans",
      "Sedans are the classic choice for those who prioritize comfort, style, and a smooth driving experience. With four doors and a separate trunk, sedans are versatile vehicles suitable for both daily commuting and longer journeys. They often feature spacious interiors, advanced safety technologies, and a balance between fuel efficiency and performance.",
    ),
    categoryCreate(
      1,
      "SUVs",
      "SUVs, or Sports Utility Vehicles, are known for their versatility and adaptability. With a higher driving position, ample cargo space, and the option for all-wheel drive, SUVs are suitable for various lifestyles. They offer a commanding view of the road, making them popular among families, outdoor enthusiasts, and those who appreciate a robust and rugged design.",
    ),
    categoryCreate(
      2,
      "Electric Cars",
      "Electric cars represent the forefront of automotive technology, offering an eco-friendly alternative to traditional combustion engines. Powered by electric motors and batteries, these cars produce zero emissions, contributing to a cleaner environment. Electric cars come in various sizes and styles, ranging from compact city commuters to high-performance models, and often feature cutting-edge technology for enhanced connectivity and energy efficiency.",
    ),
  ]);
}

async function createCars() {
  console.log("Adding cars");
  await Promise.all([
    carCreate(
      0,
      brands[0],
      "Alpha A1",
      "Sleek and stylish, luxurious interior",
      35000,
      50,
      categories[0],
    ),
    carCreate(
      1,
      brands[1],
      "Horizon E1",
      "Small electric car for urban commuting",
      25000,
      60,
      categories[2],
    ),
    carCreate(
      2,
      brands[2],
      "Velocity L3 Executive",
      "Top-of-the-line luxury sedan",
      100000,
      10,
      categories[0],
    ),
    carCreate(
      3,
      brands[0],
      "Alpha E3 Performance",
      "High-performance electric car",
      65000,
      10,
      categories[2],
    ),
  ]);
}
