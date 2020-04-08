const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../../config/services");
const User = require("../../models/User");

/*
  @rout GET api/auth
  @desc Test route
  @access Public
*/
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    await res.json(user);
  } catch (err) {
    console.log("🔥 ", err.message);
    res.status(500).send("🔥 Server Error")
  }
});

/*
  @route POST api/auth
  @desc Authenticate user & get token
  @access Public
*/
const validateInputs = [
  check("email", "please include a valid email").isEmail(),
  check(
    "password",
    "please enter a password with 6 or more characters"
  ).exists(),
];

router.post("/", validateInputs,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({errors: [{msg: "🗿 Invalid credentials"}]});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: "🗿 Invalid credentials"}]});
      }

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
