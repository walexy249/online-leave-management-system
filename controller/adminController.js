const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./../model/adminModel");
const User = require("./../model/userModel");
const Email = require("./../utils/email");

exports.getAdminPage = async (req, res) => {
  const users = await User.find();
  const approved = await User.find({ status: "approved" });
  const declined = await User.find({ status: "declined" });
  const pending = await User.find({ status: "pending" });

  res.render("admin", {
    users,
    approved,
    declined,
    pending
  });
};

exports.register = async (req, res) => {
  const { staffId } = req.body;
  const { fullname } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;
  const admin = await Admin.findOne({ email: req.body.email });
  if (admin) {
    console.log("user already exist");
    return res.render("admin_create", {
      errorMessage: "email alrealdy exist!!!",
      oldData: {
        staffId,
        fullname,
        email,
        password,
        confirmPassword
      }
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.render("admin_create", {
      errorMessage: errors.array()[0].msg,
      oldData: {
        staffId,
        fullname,
        email,
        password,
        confirmPassword
      }
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  await Admin.create({
    staffId: req.body.staffId,
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword
  });
  res.redirect("/admin/signup");
};

exports.loginPage = (req, res) => {
  res.render("login", {
    errorMessage: undefined
  });
};

exports.signupPage = (req, res) => {
  res.render("admin_create", {
    errorMessage: undefined
  });
};

exports.login = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return res.render("login", {
      oldData: {
        email,
        password
      },
      errorMessage: "invalid username or password"
    });
  }

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) {
    return res.render("login", {
      oldData: {
        email,
        password
      },
      errorMessage: "invalid username or password"
    });
  }

  req.user = admin;

  const token = jwt.sign({ id: admin._id }, "my-ultra-long-secret", {
    expiresIn: "90d"
  });

  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  });
  res.redirect("/admin");
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.redirect("/");
    }

    const decoded = await jwt.verify(req.cookies.jwt, "my-ultra-long-secret");

    const user = await Admin.findById({ _id: decoded.id });
    if (!user) {
      return res.redirect("/");
    }

    req.user = user;
    console.log("is authenticated");
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

exports.getDetailsPage = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    console.log(user);

    res.render("admin_details", {
      user
    });
  } catch (err) {
    console.log(err);
  }
};

exports.declineAppointment = async (req, res, next) => {
  const user = await User.findById({ _id: req.body.id });
  console.log(user);

  // send the email to the client by using the Email
  try {
    await new Email(user, {}).declineAppointment();
    user.status = 'declined';
    await user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/admin/${req.body.id}`);

};

exports.approveAppointment = async (req, res, next) => {
  const user = await User.findById({ _id: req.body.id });
  console.log(user);

  // send the email to the client by using the Email
  try {
    await new Email(user, {}).approveAppointment();
    user.status = 'approved';
    await user.save();
  } catch (err) {
    console.log(err);
  }

  res.redirect(`/admin/${req.body.id}`);
};