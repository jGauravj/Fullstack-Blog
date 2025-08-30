import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = () => {
  const { blog, setBlog } = useContext(BlogContext);

  // Check if blog data is available
  // if (!blog || !blog.activity) {
  //   return (
  //     <>
  //       <hr className="border-grey my-2" />
  //       <div className="flex gap-6 justify-between">
  //         <div className="flex gap-3 items-center">
  //           <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200/80">
  //             <i className="fi fi-rr-heart"></i>
  //           </button>
  //           <p className="text-base text-dark-grey">0</p>

  //           <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200/80">
  //             <i className="fi fi-rr-comment-dots"></i>
  //           </button>
  //           <p className="text-base text-dark-grey">0</p>
  //         </div>
  //       </div>
  //       <hr className="border-grey my-2" />
  //     </>
  //   );
  // }

  const {
    title,
    blog_id,
    activity: { total_likes, total_comments } = {},
    author: {
      personal_info: { username: author_username },
    },
  } = blog;
  const { userAuth: { username } = {} } = useContext(UserContext);

  return (
    <>
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200/80">
            <i className="fi fi-rr-heart"></i>
          </button>
          <p className="text-base text-dark-grey">{total_likes}</p>

          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200/80">
            <i className="fi fi-rr-comment-dots"></i>
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
