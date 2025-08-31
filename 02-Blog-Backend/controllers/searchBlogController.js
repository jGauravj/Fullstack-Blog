const Blog = require("../Schema/Blog");

const searchBlogs = async (req, res) => {
  try {
    let { tag, query, author, page, limit, eliminate_blog } = req.body;

    let findQuery;

    if (tag) {
      findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
    } else if (query) {
      findQuery = { draft: false, title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { author, draft: false };
    }

    let maxLimit = limit ? limit : 2;

    const blogs = await Blog.find(findQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .skip((page - 1) * maxLimit)
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
    console.error("Error while searching blogs:", error.message);
    res.status(401).json({
      success: false,
      message:
        "Something went wrong while searching blogs. Please try again later.",
    });
  }
};

module.exports = searchBlogs;
