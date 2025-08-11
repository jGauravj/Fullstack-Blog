import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-Animation";
import defaultBanner from "../imgs/blog-banner.png";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";

const BlogEditor = () => {
  const [loading, setLoading] = useState(false);
  const bannerRef = useRef();

  const handleBannerUpload = async (e) => {
    let img = e.target.files?.[0];
    if (!img) return;

    const formData = new FormData();
    formData.append("file", img);

    try {
      setLoading(true);
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // update the banner
      bannerRef.current.src = data.file.path;
      e.target.value = "";
      console.log(data);
    } catch (error) {
      console.error("Error uploading banner", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-9">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New blog</p>

        <div className="flex gap-4 ml-auto ">
          <button className="btn-dark py-2 ">Publish</button>
          <button className="btn-light py-2 ">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video rounded-xl bg-white border-4 border-grey overflow-hidden">
              <label
                htmlFor="uploadBanner"
                className="cursor-pointer block w-full h-full"
              >
                {/* Banner image */}
                <img
                  ref={bannerRef}
                  src={defaultBanner}
                  alt="default banner"
                  className={`rounded-xl w-full h-full object-cover transition duration-300 ${
                    loading ? "blur-sm" : ""
                  }`}
                />

                {/* Spinner overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin fill-black"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 
                 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
                 50 0.59082C77.6142 0.59082 100 22.9766 100 
                 50.5908ZM9.08144 50.5908C9.08144 73.1895 
                 27.4013 91.5094 50 91.5094C72.5987 91.5094 
                 90.9186 73.1895 90.9186 50.5908C90.9186 
                 27.9921 72.5987 9.67226 50 9.67226C27.4013 
                 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 
                 97.8624 35.9116 97.0079 33.5539C95.2932 
                 28.8227 92.871 24.3692 89.8167 20.348C85.8452 
                 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
                 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
                 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
                 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
                 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
                 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
                 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
                 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
                 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}

                {/* File input */}
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              placeholder="Blog Title"
              className="text-4xl font-medium w-full bg-red-400 h-20 resize-none mt-10 leading-tight "
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
