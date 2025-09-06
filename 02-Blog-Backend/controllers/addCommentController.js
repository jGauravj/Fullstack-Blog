const Blog = require("../Schema/Blog");
const Comment = require("../Schema/Comment");
const Notification = require("../Schema/Notification");

const addComment = async (req, res) => {
  try {
    let user_id = req.user;
    let { _id, comment, blog_author } = req.body;

    if (!comment.length) {
      return res.status(402).json({
        success: false,
        message: "Write somthing to leave a comment",
      });
    }

    // creating a comment doc
    let commentObj = new Comment({
      blog_id: _id,
      blog_author,
      comment,
      commented_by: user_id,
    });

    let commentFile = await commentObj.save();

    // Populate the comment with user data before returning
    let populatedComment = await Comment.findById(commentFile._id).populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    );

    // let { comment: savedComment, commentedAt, children } = commentFile;

    await Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          "activity.total_comments": 1,
          "activity.total_parent_comments": 1,
        },
      }
    );

    await new Notification({
      type: "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    }).save();

    return res.status(200).json({
      comment: populatedComment.comment,
      commentedAt: populatedComment.commentedAt,
      _id: populatedComment._id,
      user_id: populatedComment.commented_by._id,
      children: populatedComment.children,
      commented_by: populatedComment.commented_by,
    });
  } catch (error) {
    console.error("Error in Add Comment API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not Comment the blog.",
    });
  }
};

const getBlogComments = async (req, res) => {
  try {
    let { blog_id, skip } = req.body;
    let maxLimit = 5;

    let comment = await Comment.find({ blog_id, isReply: false })
      .populate(
        "commented_by",
        "personal_info.username personal_info.fullname personal_info.profile_img"
      )
      .skip(skip)
      .limit(maxLimit)
      .sort({
        commentedAt: -1,
      });

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error in Get Comment API:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: Could not Get Comment.",
    });
  }
};

module.exports = { addComment, getBlogComments };
