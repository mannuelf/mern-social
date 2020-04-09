const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const validateProfileInputs = require("./validations");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/*
  @rout GET api/profile/me
  @desc Get current users profile
  @access Private
*/
router.get("/me", auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({user: req.user.id}).populate("user", ["name", "avatar"]);

      if (!profile) return res.status(400).json({msg: "There is no profile for this user"});

      await res.json(profile);
    } catch (err) {
      console.log("🔥", err.message);
      res.status(500).send("Server Error");
    }
  });

/*
  @rout POST api/profile
  @desc Create or update user profile
  @access Private
*/
router.post("/", [auth, validateProfileInputs], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(",").map(skill => skill.trim()); // convert to an array.
  }

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  // update and insert all the data
  try {
    let profile = await Profile.findOne({user: req.user.id});
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true}
      );
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    await res.json(profile);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
