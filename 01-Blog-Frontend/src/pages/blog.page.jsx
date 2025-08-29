import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-Animation";
import { Spinner } from "../common/spinner";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  tags: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

const BlogPage = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(false);
  let { blog_id } = useParams();

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/get-blogs",
        { blog_id }
      );
      setBlog(res.data?.blog);
    } catch (err) {
      console.log("Error while geting blogs on BlogPage:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="flex justify-center mt-8">
          <Spinner className="w-6 h-6" />
        </div>
      ) : (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <img src={banner || null} alt="banner" className="aspect-video" />

          <div className="mt-12">
            <h2>{title}</h2>

            <div className="flex max-sm:flex-col justify-between my-8">
              <div className="flex gap-5 items-start">
                <img
                  src={profile_img || null}
                  alt="profile_img"
                  className="w-12 h-12 rounded-full"
                />
                <p className=" capitalize">
                  {fullname}
                  <br />@
                  <Link to={`/user/${author_username}`}>{author_username}</Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published on {getDay(publishedAt)}
              </p>
            </div>
          </div>
          <BlogInteraction />
        </div>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
