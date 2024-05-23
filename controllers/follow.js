const Auth = require("../models/auth");
const Activity = require("../models/activity");

export const requestFollow = async (req, res, next) => {
  const requester = req.userId;
  const { target } = req.body;

  try {
    const targetUser = await Auth.findById(target);
    const requesterUser = await Auth.findById(requester);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    if (
      targetUser.followers.includes(requester) ||
      requesterUser.followings.includes(target)
    ) {
      return res.status(400).json({
        success: false,
        message: "You already follow this user",
      });
    }

    const activity = new Activity({
      type: "follow",
      followTarget: target,
      user: requester,
    });

    targetUser.followers.push(requester);
    requesterUser.followings.push(target);
    await targetUser.save();
    await requesterUser.save();
    await activity.save();

    return res.status(200).json({
      success: true,
      message: "Follow success",
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const requestUnFollow = async (req, res, next) => {
  const requester = req.userId;
  const { target } = req.body;
  try {
    const targetUser = await Auth.findById(target);
    const requesterUser = await Auth.findById(requester);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    if (
      !targetUser.followers.includes(requester) ||
      !requesterUser.followings.includes(target)
    ) {
      return res.status(400).json({
        success: false,
        message: "You don't follow this user",
      });
    }

    targetUser.followers = targetUser.followers.filter(
      (item) => item !== requester
    );
    requesterUser.followings = requesterUser.followings.filter((item) => {
      return item !== target;
    });
    await targetUser.save();
    await requesterUser.save();
    return res.status(200).json({
      success: true,
      message: "Unfollow success",
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
