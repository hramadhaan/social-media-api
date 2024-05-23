const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  type: {
    // ini kemungkinana ada post ataupun follow
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  followTarget: {
    type: Schema.Types.ObjectId,
    ref: "auth",
  },
  referencePost: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
});

module.exports = mongoose.model("activity", activitySchema);
