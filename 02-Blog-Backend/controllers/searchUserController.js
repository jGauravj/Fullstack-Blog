const User = require("../Schema/User");

const searchUser = async (req, res) => {
  try {
    let { query } = req.body;
    const user = await User.find({
      "personal_info.username": new RegExp(query, "i"),
    })
      .limit(50)
      .select(
        "personal_info.fullname personal_info.username personal_info.profile_img -_id"
      );
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error while searching user:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while searching users. Please try again later.",
    });
  }
};

module.exports = searchUser;
