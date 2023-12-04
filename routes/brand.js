const express = require("express");
const router = express.Router();

// GET request to create brand
router.get("/brand/create", (req, res, next) => {
  res.send("Get request to create Brand: not implemented");
});

// POST request to create brand
router.post("/brand/create", (req, res, next) => {
  res.send("post request to create Brand: not implemented");
});

// GET request to delete brand
router.get("/brand/:id/delete", (req, res, next) => {
  res.send("Get request to delete Brand: not implemented");
});

// POST request to delete brand
router.post("/brand/:id/delete", (req, res, next) => {
  res.send("post request to delete Brand: not implemented");
});

// GET request to update brand
router.get("/brand/:id/update", (req, res, next) => {
  res.send("get request to update Brand: not implemented");
});

// POST request to update brand
router.post("/brand/:id/update", (req, res, next) => {
  res.send("post request to update Brand: not implemented");
});

// GET request to get one brand
router.get("/brand/:id", (req, res, next) => {
  res.send(`get request to specific brand id: ${req.params.id}`);
});

// All Brands list routes
router.get("/", (req, res, next) => {
  res.send("All brands list: not implemented");
});

module.exports = router;
