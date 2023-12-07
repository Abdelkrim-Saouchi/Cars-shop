var express = require("express");
var router = express.Router();
const homePageController = require("../controllers/homePageController");

/* GET home page. */
router.get("/", homePageController.index);

module.exports = router;
