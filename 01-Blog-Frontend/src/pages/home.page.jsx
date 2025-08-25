import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-Animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { Spinner } from "../common/spinner";
import BlogPostCard from "../components/blog-post.component";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);

  const fetchLatestBlogs = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/latest-blogs"
      );
      setBlogs(res.data?.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest Blog */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Spinner />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* Filters & Tranding Blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
