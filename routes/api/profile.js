const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const validateProfileInputs = require("./validations");
const request = require("request");
const config = require("../../config/services");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post"):

/*
  @route GET api/profile/me
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
  @route POST api/profile
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

/*
  @route GET api/profile
  @desc Get all profiles
  @access Public
*/
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    await res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

/*
  @route GET api/profile/user/:user_id
  @desc Get profile by user ID
  @access Public
*/
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({msg: "Profile not found"});
    await res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({msg: "Profile not found"});
    }
    res.status(500).send("Profile not found");
  }
});

/*
  @route DELETE api/profile
  @desc Delete profile, user and posts
  @access Private
*/
router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({user: req.user.id});
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({_id: req.user.id});
    await Profile.findOneAndRemove({_id: req.user.id});
    await res.json({msg: "User removed"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

/*
  @route PUT api/profile/experience
  @desc Update profile
  @access Private
*/
const validateExperienceInputs = [
  check("title", "Title is required").not().isEmpty(),
  check("company", "Company is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty(),
];

router.put("/experience", [auth, validateExperienceInputs],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({user: req.user.id});
      profile.experience.unshift(newExperience);
      await profile.save();
      await res.json(profile)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

/*
  @route DELETE api/profile/experience/:exp_id
  @desc Delete experience
  @access Private
*/
router.delete("/experience/:id", auth, async (req, res) => {
  const profile = await Profile.findOne({user: req.user.id});

  // get the one to be removed
  const removeIndex = profile.experience
    .map(item => item.id)
    .indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex, 1);

  await profile.save();
  await res.json(profile);
});

/*
  @route PUT api/profile/education
  @desc Update profile
  @access Private
*/
const validateEducationInputs = [
  check("school", "School is required").not().isEmpty(),
  check("degree", "degree is required").not().isEmpty(),
  check("fieldofstudy", "Study is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty(),
];

router.put("/education", [auth, validateEducationInputs],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
    };

    try {
      const profile = await Profile.findOne({user: req.user.id});
      profile.education.unshift(newEducation);
      await profile.save();
      await res.json(profile)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

/*
  @route DELETE api/profile/education/:edu_id
  @desc Delete education
  @access Private
*/
router.delete("/education/:id", auth,
  async (req, res) => {
    const profile = await Profile.findOne({user: req.user.id});

    // get the one to be removed
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    await res.json(profile);
  });

/*
  @route GET api/profile/github/:username
  @desc Get user github profile data
  @access Public
*/
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.github.clientId}&client_secret=${config.github.clientSecret}`,
      method: "GET",
      headers: {"user-agent": "node.js"},
    };

    request(options, (error, response) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({msg: "🔴 Sorry no github profile was found."})
      }
      res.json(JSON.parse(response.body)); // convert from string to json.
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
