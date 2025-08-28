const Blog = require("../Schema/Blog");

const allLatestBlogsCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments({ draft: false });

    return res.status(200).json({
      totalDocs: count,
    });
  } catch (error) {
    console.error("Error in all latest blog count API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch all latest blog count blogs.",
    });
  }
};

module.exports = allLatestBlogsCount;
