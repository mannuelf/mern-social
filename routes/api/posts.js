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

/*
  @route GET api/posts
  @desc Get all posts
  @access Private
*/
router.get("/", auth,
  async (req, res) => {
    try {
      const posts = await Post.find().sort({date: -1});
      await res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

/*
  @route GET api/posts/:id
  @desc Get post by ID
  @access Private
*/
router.get("/:id", auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).json({msg: "Post not found"});

      await res.json(post);
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") return res.status(404).json({msg: "Post not found"}); // if no post found

      res.status(500).send("Server Error");
    }
  });

/*
  @route DELETE api/posts/:id
  @desc Delete a post by :id
  @access Private
*/
router.delete("/:id", auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(404).json({msg: "🔴 Post not found"}); // if no post found

      if (post.user.toString() !== req.user.id) { // check user owns post first
        return res.status(401).json({msg: "🔴 User not authorised"});
      }

      await post.remove();
      await res.json({ msg: "🟢 Post removed."});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
