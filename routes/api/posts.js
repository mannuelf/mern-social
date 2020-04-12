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
      await res.json({msg: "🟢 Post removed."});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

/*
  @route PUT api/posts/like/:id
  @desc Like a post by id
  @access Private
*/
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const likedPosts = post.likes.filter((like) => like.user.toString() === req.user.id);

    if (likedPosts.length > 0) {
      return res.status(400).json({msg: "Post already liked"});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();
    await res.json(post.likes);
  } catch (err) {
    console.error("🔥", err.message);
    res.status(500).send("Server Error");
  }
});

/*
  @route PUT api/posts/unlike/:id
  @desc Unlike a post by id
  @access Private
*/
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const likedPosts = post.likes.filter((like) => like.user.toString() === req.user.id);

    if (likedPosts.length === 0) {
      return res.status(400).json({msg: "Post has not been liked."});
    }
    // remove a like
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    await res.json(post.likes);
  } catch (err) {
    console.error("🔥", err.message);
    res.status(500).send("Server Error");
  }
});

/*
  @route GET api/posts/comment/:id
  @desc Create a comment
  @access Private
*/
router.post("/comment/:id", [auth, [check("text", "Text is require").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      console.log("🤖", "got here")
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      // instantiate new comment object.
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comment.unshift(newComment);
      await post.save();
      await res.json(post.comment);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("No user found");
    }
  });

/*
  @route DELETE api/posts/comment/:id/:comment_id
  @desc Delete a comment
  @access Private
*/
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Pull comment out
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    // make sure comment exists
    if (!comment) {
      return res.status(404).json({msg: "Comment does not exist"});
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "User is not authorised"});
    }
    // Remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    await res.json(post.comments);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
