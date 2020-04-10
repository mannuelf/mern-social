const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // points to the _id field in record.
    ref: "user" // create reference to the User model, every post should be associated with a user.
  },
  name: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  likes: [{
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  }],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
