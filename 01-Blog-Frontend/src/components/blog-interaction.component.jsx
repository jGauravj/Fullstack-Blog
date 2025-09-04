import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  const { blog, setBlog, isLikeByUser, setIsLikeByUser, setCommentsWrapper } =
    useContext(BlogContext);

  const {
    _id,
    title,
    blog_id,
    activity: { total_likes, total_comments } = {},
    author: {
      personal_info: { username: author_username },
    },
  } = blog;
  const { userAuth: { username, access_token } = {} } = useContext(UserContext);

  useEffect(() => {
    const fetchIslikedBlog = async () => {
      try {
        if (access_token) {
          // make request to server to get like notification
          let res = await axios.post(
            import.meta.env.VITE_SERVER_DOMAIN + "/api/isliked-by-user",
            { _id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setIsLikeByUser(Boolean(res.data?.result));
        }
      } catch (err) {
        console.error("error", err);
      }
    };
    fetchIslikedBlog();
  }, []);

  const handleLike = async () => {
    try {
      if (!access_token) {
        toast.error("Please login to like this blog");
        return;
      }

      setIsLikeByUser((prev) => {
        setBlog((prevBlog) => ({
          ...prevBlog,
          activity: {
            ...prevBlog.activity,
            total_likes: prev
              ? prevBlog.activity.total_likes - 1
              : prevBlog.activity.total_likes + 1,
          },
        }));
        return !prev;
      });

      let res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/like-blog",
        { _id, isLikeByUser },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error in like:", err.message);
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              isLikeByUser ? "bg-red-200/80 text-red-600" : "bg-gray-200/80 "
            }`}
            onClick={handleLike}
          >
            <i className={`fi fi-${isLikeByUser ? "sr" : "rr"}-heart mt-1`}></i>
          </button>
          <p className="text-base text-dark-grey">{total_likes}</p>

          <button
            onClick={() => setCommentsWrapper((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200/80 cursor-pointer"
          >
            <i className="fi fi-rr-comment-dots mt-1"></i>
          </button>
          <p className="text-base text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple-600"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-twitter-alt text-xl hover:text-blue-500"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
