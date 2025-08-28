const Blog = require("../Schema/Blog");

const trendingBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({
        "activity.total_reads": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
      })
      .select("blog_id title publishedAt -_id")
      .limit(5)
      .exec();

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error in trending blog API:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch trending blogs.",
    });
  }
};

module.exports = trendingBlog;
