import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-Animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { Spinner } from "../common/spinner";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/minimalBlogPost.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { FilterPaginationData } from "../common/filter-paginationData";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  let categories = [
    "health",
    "technology",
    "motivation",
    "mental-health",
    "money",
    "nature",
    "Programming",
    "books",
    "lifestyle",
  ];

  const fetchLatestBlogs = async (page = 1) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/latest-blogs",
        { page }
      );
      console.log(res.data.data);
      let formatedData = await FilterPaginationData({
        state: blogs,
        data: res.data?.data,
        page,
        countRoute: "/api/all-latest-blogs-count",
      });
      console.log(formatedData);
      setBlogs(formatedData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const fetchBlogsByCategory = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/search-blogs",
        { tag: pageState }
      );
      setBlogs(res.data?.data);
    } catch (err) {
      console.error("Error while searching blogs:", err);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/trending-blogs"
      );
      setTrendingBlogs(res.data?.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  const loadBlogCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest Blog */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Spinner />
              ) : blogs?.results?.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <NoDataMessage message="No blog published" />
              )}
            </>

            {trendingBlogs == null ? (
              <Spinner />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        {/* Filters & Tranding Blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <button
                        className={`tag text-sm hover:bg-black hover:text-white transition-colors duration-300 ease-out cursor-pointer ${
                          pageState == category ? "bg-black text-white" : ""
                        }`}
                        onClick={loadBlogCategory}
                      >
                        {category}
                      </button>
                    </AnimationWrapper>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Spinner />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
