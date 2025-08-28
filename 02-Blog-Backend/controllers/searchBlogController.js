const Blog = require("../Schema/Blog");

const searchBlogs = async (req, res) => {
  try {
    let { tag } = req.body;

    let findQuery = { tags: tag, draft: false };

    let maxLimit = 5;

    const blogs = await Blog.find(findQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .limit(maxLimit)
      .exec();

    // if (!blogs.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: `No blogs found with tag: "${tag}"`,
    //   });
    // }

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error while searching blogs:", error);
    resizeBy.status(401).json({
      success: false,
      message:
        "Something went wrong while searching blogs. Please try again later.",
    });
  }
};

module.exports = searchBlogs;
