const Blog = require("../Schema/Blog");

const latestBlog = async (req, res) => {
  try {
    let maxLimit = 5;
    const blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .limit(maxLimit)
      .exec();

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error in latest blog API:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch latest blogs.",
    });
  }
};

module.exports = latestBlog;
