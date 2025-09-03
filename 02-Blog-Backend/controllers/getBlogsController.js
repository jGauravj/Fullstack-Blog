const Blog = require("../Schema/Blog");
const User = require("../Schema/User");

const getBlogsController = async (req, res) => {
  try {
    let { blog_id, draft, mode } = req.body;

    let incrementVal = mode != "edit" ? 1 : 0;

    let blog = await Blog.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } }
    )
      .populate(
        "author",
        "personal_info.fullname personal_info.username personal_info.profile_img"
      )
      .select("title des content banner activity publishedAt blog_id tags");
    await User.findOneAndUpdate(
      { "personal_info.username": blog.author.personal_info.username },
      {
        $inc: { "account_info.total_reads": incrementVal },
      }
    );

    if (blog.draft && !draft) {
      res.status(500).json({
        success: false,
        message: "You can not access draft blogs",
      });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error in get Blog API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not fetch get Blog.",
    });
  }
};

module.exports = getBlogsController;
