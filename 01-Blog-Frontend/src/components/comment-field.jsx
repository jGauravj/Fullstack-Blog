import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action }) => {
  const [comment, setComment] = useState("");
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      activity,
    },
    blog,
    setBlog,
    setTotalParentCommentLoaded,
  } = useContext(BlogContext);

  const total_comments = activity?.total_comments;
  const total_parent_comments = activity?.total_parent_comments;

  const handleComment = async () => {
    try {
      if (!access_token) {
        return toast.error("Login first to leave a comment");
      }

      if (!comment.length) {
        return toast.error("Write somthing to leave a comment..");
      }

      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/add-comment",
        { _id, blog_author, comment },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setComment("");
      let data = res.data;

      // data.personal_info = { username, profile_img, fullname };
      data.childrenLevel = 0;

      // let newCommentedArr;

      // res.data.childrenLevel = 0;

      // newCommentedArr = [data];

      let parentCommentIncrementVal = 1;

      setBlog({
        ...blog,
        comments: {
          ...comments,
          results: [data, ...(comments?.results || [])],
        },
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parent_comments:
            total_parent_comments + parentCommentIncrementVal,
        },
      });

      setTotalParentCommentLoaded((prev) => prev + parentCommentIncrementVal);
    } catch (err) {
      console.log("Error while commenting", err);
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentField;
