const express = require("express");
const router = express.Router();

/*
  @rout POST api/users
  @desc Register user
  @access Public
*/
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("User route");
});

module.exports = router;