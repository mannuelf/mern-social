const express = require("express");
require("dotenv").config();
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../../config/services");
const User = require("../../models/User");

/*
  @route POST api/users
  @desc Register user
  @access Public
*/
const validateInputs = [
  check("name", "name is required").not().isEmpty(),
  check("email", "please include a valid email").isEmail(),
  check(
    "password",
    "please enter a password with 6 or more characters"
  ).isLength({min: 6}),
];
router.post("/", validateInputs, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {name, email, password} = req.body;

  try {
    let user = await User.findOne({email});
    if (user) {
      return res.status(400).json({errors: [{msg: "User already exists"}]});
    }

    const avatar = gravatar.url(email, {
      s: "200",
      m: "pg",
      d: "mm",
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, config.jwtSecret,
      {expiresIn: 360000},
      (err, token) => {
        if (err) throw err;
        res.json({token});
      });
  } catch (err) {
    console.log("🔥 ", err.message);
    res.status(500).send("🔥 Server error");
  }
});

module.exports = router;
