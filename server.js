const express = require("express");

const app = express();

const sales = require("./routes/sales");
const multer = require("multer");

app.use("/sales", sales);

module.exports = app;
