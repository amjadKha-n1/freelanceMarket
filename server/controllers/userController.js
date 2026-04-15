const User = require("../models/User");
const Order = require("../models/Order");

exports.getMyProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const user = await User.findById(loggedInUser._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not available" });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log("found user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    console.log("User role", user.role);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const updateData = {
      name: req.body.name,
      bio: req.body.bio,
      skills: req.body.skills,
      avatar: req.body.avatar,
    };

    const user = await User.findByIdAndUpdate(
      loggedInUser._id,
      { $set: updateData },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.becomeFreelancer = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not logged in!" });
    }
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    user.skills = req.body.skills;
    user.bio = req.body.bio;
    user.freelancerRequest = {
      status: "pending",
      submittedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      message: "Submit Become Freelancer form sent Successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        bio: user.bio,
        requestStatus: user.freelancerRequest.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
