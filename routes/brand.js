const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

// GET request to create brand
router.get("/brand/create", brandController.brandCreateGet);

// POST request to create brand
router.post("/brand/create", brandController.brandCreatePost);

// GET request to delete brand
router.get("/brand/:id/delete", brandController.brandDeleteGet);

// POST request to delete brand
router.post("/brand/:id/delete", brandController.brandDeletePost);

// GET request to update brand
router.get("/brand/:id/update", brandController.brandUpdateGet);

// POST request to update brand
router.post("/brand/:id/update", brandController.brandUpdatePost);

// GET request to get one brand
router.get("/brand/:id", brandController.brandDetails);

// All Brands list routes
router.get("/", brandController.brandList);

module.exports = router;
