const express = require("express");
const { body } = require("express-validator/check");
const Admin = require("./../model/adminModel");

const adminController = require("./../controller/adminController");

const router = express.Router();

router.route("/admin").get(adminController.isAuthenticated, adminController.getAdminPage);
router.get("/admin/signup", adminController.isAuthenticated, adminController.signupPage);
router.post(
  "/admin/signup", adminController.isAuthenticated,
  [
    // body("email").custom(async (value, { req }) => {
    //   const admin = await Admin.findOne({ email: value });
    //   if (admin) {
    //     console.log("user already exist");
    //     return Promise.reject(new Error('Email already exist'));
    //   }
    // }),
    body("password")
      .isLength({ min: 5 })
      .withMessage("passsword must be more than 5 character"),
    body("confirmPassword").custom((value, { req }) => {
      if (req.body.password !== value) {
        console.log("password must match");
        throw new Error("password must match");
      }
      return true;
    })
  ],
  adminController.register
);

router.route("/login").get(adminController.loginPage).post(adminController.login);
router.get("/admin/:id",  adminController.getDetailsPage);
router.route('/admin/decline-appointment').post(adminController.declineAppointment);
router.route('/admin/approve-appointment').post(adminController.approveAppointment);

module.exports = router;
