const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET request to create category
router.get("/category/create", categoryController.categoryCreateGet);

// POST request to create category
router.post("/category/create", categoryController.categoryCreatePost);

// GET request to delete category
router.get("/category/:id/delete", categoryController.categoryDeleteGet);

// POST request to delete category
router.post("/category/:id/delete", categoryController.categoryDeletePost);

// GET request to update category
router.get("/category/:id/update", categoryController.categoryUpdateGet);

// POST request to update category
router.post("/category/:id/update", categoryController.categoryUpdatePost);

// GET request to get one category
router.get("/category/:id", categoryController.categoryDetails);

// GET request for all categories
router.get("/", categoryController.categoryList);

module.exports = router;
