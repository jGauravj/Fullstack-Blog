const Blog = require("../Schema/Blog");
const Notification = require("../Schema/Notification");

const likeBlog = async (req, res) => {
  try {
    let user_id = req.user;
    let { _id, isLikeByUser } = req.body;

    let incrementalVal = !isLikeByUser ? 1 : -1;

    // update blog likes
    let blog = await Blog.findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": incrementalVal } }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (!isLikeByUser) {
      let like = new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id,
      });
      await like.save();

      return res.status(200).json({
        success: true,
        liked_by_user: true,
        total_likes: blog.activity.total_likes,
      });
    } else {
      await Notification.findOneAndDelete({
        user: user_id,
        blog: _id,
        type: "like",
      });
      return res.status(200).json({
        liked_by_user: false,
      });
    }
  } catch (error) {
    console.error("Error in like blog API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not like/unlike the blog.",
    });
  }
};

const isLikedByUser = async (req, res) => {
  try {
    let user_id = req.user;

    let { _id } = req.body;

    let result = await Notification.exists({
      user: user_id,
      type: "like",
      blog: _id,
    });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error in liked by user blog API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not like/unlike the blog.",
    });
  }
};

module.exports = { likeBlog, isLikedByUser };
