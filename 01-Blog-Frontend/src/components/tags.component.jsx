import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog: { tags },
    setBlog,
    blog,
  } = useContext(EditorContext);

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  const handleTagDelete = () => {
    tags = tags.filter((i) => i !== tag);
    setBlog({ ...blog, tags });
  };

  // const handleTagEdit = (e) => {
  //   if (e.keyCode == 13 || e.keyCode === 188) {
  //     // enter key
  //     e.preventDefault();

  //     let currentTag = e.target.innerText;
  //     tags[tagIndex] = currentTag;

  //     setBlog({ ...blog, tags });
  //     e.target.setAttribute("contentEditable", false);
  //   }
  // };

  const handleTagBlur = (e) => {
    const currentTag = e.target.innerText.trim();

    // Only update if tag has changed and is not empty
    if (currentTag && currentTag !== tag) {
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
    } else {
      // Reset to original tag if empty or unchanged
      e.target.innerText = tag;
    }

    e.target.setAttribute("contentEditable", false);
  };

  const handleTagKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      e.target.blur(); // This will trigger onBlur to save the tag
    }

    // Escape key to cancel editing
    if (e.keyCode === 27) {
      e.target.innerText = tag; // Reset to original
      e.target.blur();
    }
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:opacity-70 pr-10">
      <p
        className="outline-none"
        onKeyDown={handleTagKeyDown}
        onClick={addEditable}
        onBlur={handleTagBlur}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
