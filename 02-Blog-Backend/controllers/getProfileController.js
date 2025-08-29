const User = require("../Schema/User");

const getProfile = async (req, res) => {
  try {
    let { username } = req.body;

    const user = await User.findOne({
      "personal_info.username": username,
    }).select("-personal_info.password -google_auth -updatedAt -blogs");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in get profile API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch get profile.",
    });
  }
};

module.exports = getProfile;
