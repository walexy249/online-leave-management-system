const express = require("express");

const userController = require("./../controller/userController");

const router = express.Router();

router.route("/apply").get(userController.getLeavePage).post(userController.applyForLeave)

module.exports = router;