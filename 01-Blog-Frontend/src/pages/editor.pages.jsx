import { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { Spinner } from "../common/spinner";
import axios from "axios";
// import defaultBanner from "../imgs/blog-banner.png";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  let { blog_id } = useParams();

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blog_id) {
        return setLoading(false);
      }

      try {
        const res = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/get-blogs",
          {
            blog_id,
            draft: true,
            mode: "edit",
          }
        );
        setBlog(res.data.blog);
      } catch (error) {
        console.error("somthing went wrong:", error.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <div className="flex w-full itsems-center justify-center mt-20 ">
          <Spinner className="w-6 h-6" />
        </div>
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
