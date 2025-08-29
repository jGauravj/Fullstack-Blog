const Blog = require("../Schema/Blog");

const searchBlogCount = async (req, res) => {
  try {
    let { tag, query } = req.body;

    let findQuery;

    if (tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { draft: false, title: new RegExp(query, "i") };
    }

    let blogs = await Blog.countDocuments(findQuery);

    res.status(200).json({ totalDocs: blogs });
  } catch (error) {
    console.error("Error while searching blogs count:", error.message);
    res.status(401).json({
      success: false,
      message:
        "Something went wrong while searching blogs count. Please try again later.",
    });
  }
};

module.exports = searchBlogCount;
