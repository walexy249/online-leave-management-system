const express = require("express");
const indexController = require("../controller/indexController");

const router = express.Router();

router.route("/").get(indexController.getIndexPage);

module.exports = router;
