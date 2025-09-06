import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog-banner.png";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import { Spinner } from "../common/spinner";

const BlogEditor = () => {
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  let navigate = useNavigate();
  let { blog_id } = useParams();

  let {
    blog,
    blog: { title, banner, content },
    setBlog,
    textEditor,
    setTextEditor,
    // editorState,
    setEditorState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      })
    );
  }, []);

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
      setBlog({ ...blog, banner: data?.file?.path });
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
    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = () => {
    if (!banner) {
      return toast.error("Upload a blog banner to publish it");
    }
    if (!title.length) {
      return toast.error("Write blog title to publish it");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write somthing in your blog to publish");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();

    if (isDraft) return;

    if (!title.length) {
      return toast.error("write blog title before saving it as a draft");
    }

    try {
      setIsDraft(true);

      let blogObj = {
        title,
        banner,
        content,
        draft: true,
      };

      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/create-blog",
        { ...blogObj, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Draft saved successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Draft save failed");
    } finally {
      setIsDraft(false);
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-9">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto ">
          <button
            className="btn-dark py-2 cursor-pointer "
            onClick={handlePublishEvent}
          >
            Publish
          </button>

          <button
            className={`btn-light py-2 inline-flex items-center gap-2 cursor-pointer ${
              isDraft ? " opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSaveDraft}
            disabled={isDraft}
            aria-busy={isDraft}
          >
            {isDraft ? <Spinner className="w-4 h-4" /> : null}
            <span>{isDraft ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video rounded-lg bg-white border-4 border-grey overflow-hidden">
              <label
                htmlFor="uploadBanner"
                className="cursor-pointer block w-full h-full"
              >
                {/* Banner image */}
                <img
                  src={banner ? banner : defaultBanner}
                  // onError={handleError}
                  alt="blog banner"
                  className={` w-full h-full object-cover transition duration-300 ${
                    loading ? "blur-sm" : ""
                  }`}
                />

                {/* Spinner overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Spinner className="w-8 h-8" />
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
              className="text-3xl md:text-4xl font-medium w-full h-20 resize-none mt-10 leading-tight"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
              defaultValue={title}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
