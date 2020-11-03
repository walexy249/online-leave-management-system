const User = require("./../model/userModel");

exports.getLeavePage = (req, res) => {
    res.render("apply");
}


exports.applyForLeave = async (req, res) => {
    await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        typeOfLeave: req.body.typeOfLeave,
        reason: req.body.reason,
        date: req.body.date,
        duration: req.body.duration
    });
    console.log("leave created successfully");
    res.redirect("/apply");
}

