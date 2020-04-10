const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const PostSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
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
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  }],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
