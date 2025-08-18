// importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

const uploadImageByURL = (url) => {
  return Promise.resolve({
    success: 1,
    file: { url },
  });
};

const uploadImageByFile = async (e) => {
  let file = e.target.files?.[0];
  if (!file) {
    console.log("No file selected");
    return;
  }
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + "/api/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return {
      success: 1,
      file: {
        url: data.file.path,
      },
    };
  } catch (error) {
    console.error("EditorJS image upload error:", error);
    return {
      success: 0,
    };
  }
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
