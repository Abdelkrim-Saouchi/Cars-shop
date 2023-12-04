const express = require("express");
const router = express.Router();

// GET request to create category
router.get("/category/create", (req, res) => {
  res.send("Get request to create category");
});

// POST request to create category
router.post("/category/create", (req, res) => {
  res.send("Post request to create category");
});

// GET request to delete category
router.get("/category/:id/delete", (req, res) => {
  res.send(`get request to delete: ${req.params.id}`);
});

// POST request to delete category
router.post("/category/:id/delete", (req, res) => {
  res.send(`post request to delete: ${req.params.id}`);
});

// GET request to update category
router.get("/category/:id/update", (req, res) => {
  res.send(`get request to update: ${req.params.id}`);
});

// POST request to update category
router.post("/category/:id/update", (req, res) => {
  res.send(`post request to update: ${req.params.id}`);
});

// GET request to get one category
router.get("/category/:id", (req, res) => {
  res.send(`get request to get id: ${req.params.id}`);
});

// GET request for all categories
router.get("/", (req, res) => {
  res.send("All categories: not implemented");
});

module.exports = router;
