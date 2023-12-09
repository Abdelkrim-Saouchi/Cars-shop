const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

// GET request to create car
router.get("/car/create", carController.carCreateGet);

// POST request to create car
router.post("/car/create", carController.carCreatePost);

// GET request to delete car
router.get("/car/:id/delete", carController.carDeleteGet);

// POST request to delete car
router.post("/car/:id/delete", carController.carDeletePost);

// GET request to update car
router.get("/car/:id/update", carController.carUpdateGet);

// POST request to update car
router.post("/car/:id/update", (req, res) => {
  res.send(`post request to update: ${req.params.id}`);
});

// GET request to get one car
router.get("/car/:id", carController.carDetails);

// GET request for All cars
router.get("/", carController.carsList);

module.exports = router;
