import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-Animation";
import { Spinner } from "../common/spinner";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: {
    personal_info: {},
  },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlog, setSimilarBlog] = useState(null);
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
      const fetchedBlog = res.data?.blog;
      setBlog(fetchedBlog);

      if (fetchedBlog?.tags?.length) {
        let response = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/search-blogs",
          { tag: fetchedBlog.tags[0], limit: 6, eliminate_blog: blog_id }
        );
        setSimilarBlog(response.data);
      }
    } catch (err) {
      console.log("Error while geting blogs on BlogPage:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlog(null);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="flex justify-center mt-8">
          <Spinner className="w-6 h-6" />
        </div>
      ) : (
        <BlogContext.Provider value={{ blog, setBlog }}>
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
                    <br />
                    <Link
                      to={`/user/${author_username}`}
                      className="text-sm text-dark-grey"
                    >
                      @{author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>
            <BlogInteraction />

            <div className="my-8 font-gelasio blog-page-content">
              {content?.[0]?.blocks?.map((block, i) => {
                return (
                  <div key={i} className="my-2 md:my-4">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction />

            {similarBlog && similarBlog.data?.length > 0 && (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Simmilar Blogs
                </h1>
                {similarBlog.data.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
