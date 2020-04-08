const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/*
  @rout GET api/profile/me
  @desc Get current users profile
  @access Private
*/
router.get("/", auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({user: req.user.id}).populate("user", ["name", "avatar"]);

      if (!profile) return res.status.json({msg: "There is no profile for this user"});

      await res.json(profile);
    } catch (err) {
      console.log("🔥", err.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
