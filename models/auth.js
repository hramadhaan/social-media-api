const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: "auth",
  },
  followings: {
    type: [Schema.Types.ObjectId],
    ref: "auth",
  },
  posts: {
    type: [Schema.Types.ObjectId],
    ref: "post",
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
});

module.exports = mongoose.model("auth", authSchema);
