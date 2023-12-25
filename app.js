const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const compression = require('compression');
const helmet = require('helmet');


const indexRouter = require("./routes/index");
const brandRouter = require("./routes/brand");
const categoryRouter = require("./routes/category");
const carRouter = require("./routes/car");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet())
app.use(compression())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up db connection
mongoose.set("strictQuery", false);
const mgDB_URL = process.env.DB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mgDB_URL);
}

app.use("/", indexRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/cars", carRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
