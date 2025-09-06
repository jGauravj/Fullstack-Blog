import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import { Spinner } from "../common/spinner";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import axios from "axios";
import { FilterPaginationData } from "../common/filter-paginationData";
import UserCard from "../components/user-card.component";

const SearchPage = () => {
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);
  let { query } = useParams();

  const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/search-blogs",
        { query, page }
      );
      let formatedData = await FilterPaginationData({
        state: blogs,
        data: res.data?.data,
        page,
        countRoute: "/api/search-blogs-count",
        data_to_send: { query },
        create_new_arr,
      });
      setBlogs(formatedData);
    } catch (err) {
      console.error("Error in search blog:", err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/search-users",
        { query }
      );
      setUsers(res.data.user);
    } catch (err) {
      console.error("Error in searching users:", err.message);
    }
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Spinner />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for "${query}"`, "Users"]}
          defaultHidden={["Users"]}
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
            <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search <i className="fi fi-rr-user"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
