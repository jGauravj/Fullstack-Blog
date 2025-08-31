const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="img" />
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple-500/10 p-3 pl-5 border-l-4  border-purple-500">
      <p className="text-lg leading-10 md:text-xl">{quote}</p>
      {caption.length ? (
        <p className="w-full text-purple-600 text-base">{caption}</p>
      ) : (
        ""
      )}
    </div>
  );
};

const Checklist = ({ items }) => {
  return (
    <div className="my-1 ml-5">
      {items.map((item, i) => {
        const isChecked = item.meta?.checked || false;
        return (
          <div key={i} className=" flex items-center">
            <input
              type="checkbox"
              checked={item.meta?.checked || false}
              readOnly
              className={`mr-2 h-4 w-4 accent-blue-500 ${
                isChecked ? "border-blue-500" : ""
              }`}
            />
            <span
              dangerouslySetInnerHTML={{ __html: item.content }}
              className={isChecked ? " text-blue-500 text-lg" : " text-lg"}
            ></span>
          </div>
        );
      })}
    </div>
  );
};

const List = ({ style, items }) => {
  // Handle checklist type
  if (style === "checklist") {
    return <Checklist items={items} />;
  }

  // Handle ordered and unordered lists
  const Tag = style === "ordered" ? "ol" : "ul";

  // Add appropriate class for list styling
  const listClass = style === "ordered" ? "list-decimal" : "list-disc";

  return (
    <Tag className={`my-1 ml-10 ${listClass}`}>
      {items.map((item, i) => {
        return (
          <li
            key={i}
            className=" text-lg"
            dangerouslySetInnerHTML={{ __html: item.content }}
          ></li>
        );
      })}
    </Tag>
  );
};

const BlogContent = ({ block }) => {
  let { type, data } = block;
  console.log(data);

  if (type == "paragraph") {
    return (
      <p
        className="text-lg"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></p>
    );
  }
  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="text-2xl font-bold"
        ></h3>
      );
    }
    return (
      <h2
        dangerouslySetInnerHTML={{ __html: data.text }}
        className="text-3xl font-bold"
      ></h2>
    );
  }

  if (type == "image") {
    return <Img url={data?.file?.url} alt="img" caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote quote={data?.text} caption={data?.caption} />;
  }

  if (type == "list") {
    return <List style={data?.style} items={data?.items} />;
  }
};

export default BlogContent;
