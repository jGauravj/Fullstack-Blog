const { nanoid } = require("nanoid");
const Blog = require("../Schema/Blog");
const User = require("../Schema/User");

const createBlog = async (req, res) => {
  try {
    const authorId = req.user;

    let { title, banner, content, tags, des, draft, id } = req.body;

    if (!title?.length) {
      return res.status(403).json({
        message: "You must provide a title",
      });
    }

    if (!draft) {
      if (!des?.length || des.length > 200) {
        return res.status(403).json({
          message: "You must provide blog description under 200 characters",
        });
      }

      if (!banner?.length) {
        return res.status(403).json({
          message: "You must provide blog banner to publish it",
        });
      }

      if (!content?.blocks?.length) {
        return res.status(403).json({
          message: "There must be some blog content to publish it",
        });
      }

      if (!tags?.length || tags.length > 10) {
        return res.status(403).json({
          message: "Provided tags in order to publish the blog, maximum 10",
        });
      }
    }

    // lower case the tags
    tags = tags?.length ? tags.map((tag) => tag.toLowerCase()) : [];

    const blog_id = id
      ? id
      : title
          .replace(/[^a-zA-Z0-9]/g, " ")
          .replace(/\s+/g, "-")
          .trim() + nanoid();

    if (id) {
      await Blog.findOneAndUpdate(
        { blog_id: id },
        { title, des, banner, content, tags, draft: draft ? draft : false }
      );
      res.status(200).json({ id: blog_id });
    } else {
      const blog = new Blog({
        title,
        des,
        content,
        tags,
        banner,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
      });
      const saveBlog = await blog.save();
      if (saveBlog) {
        let incrementVal = draft ? 0 : 1;

        await User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        );
        return res.status(200).json({
          success: true,
          message: "Blog created successfully",
          id: blog.blog_id,
        });
      }
      // if saveBlog not working
      return res.status(500).json({
        success: false,
        message: "Somthing went wrong while saving blog",
      });
    }
  } catch (error) {
    console.error("Error->", error);
    res.status(402).json({
      success: false,
      message: "Create blog faild",
    });
  }
};

module.exports = createBlog;
