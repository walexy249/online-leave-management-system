const path = require("path");
require('dotenv').config({
  path: path.join(__dirname, 'config.env')
});
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const indexRoute = require("./routes/indexRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

app.use(indexRoute);
app.use(userRoute);
app.use(adminRoute);
mongoose
  .connect("mongodb://localhost:27017/onlineLeave", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Database connection successful"));

app.listen(3000, () => {
  console.log("app started on port 3000");
});
