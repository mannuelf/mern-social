const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/*
  @route GET api/posts
  @desc Create a post
  @access Private
*/
router.post("/", [auth, [check("text", "text is require").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      // instantiate new post from the model
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      await res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("No user found");
    }
  });

module.exports = router;
