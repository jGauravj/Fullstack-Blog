import { Link } from "react-router-dom";
import pageNotFoundImg from "../imgs/404.png";
import fulllogo from "../imgs/logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={pageNotFoundImg}
        alt="page_not_found_img"
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded-xl"
      />
      <h1 className="md:text-4xl text-3xl font-gelasio leading-7">
        Oops! Page Not Found.
      </h1>
      <p className="text-dark-grey md:text-xl text-base leading-7 -mt-10 text-center">
        Hmm… we couldn’t find the page you were looking for. Don't worry, the{" "}
        <Link to="/" className="text-black md:text-xl text-base underline ">
          home page
        </Link>{" "}
        is just a click away!
      </p>

      <div className="mt-auto">
        <div className=" gap-4 flex items-center justify-center">
          <img
            src={fulllogo}
            alt="logo"
            className="h-8 w-8 object-contain select-none "
          />
          <h1 className="text-2xl font-medium select-none">ThinkSpace</h1>
        </div>
        <p className="mt-5 text-dark-grey">
          Millions of thoughts. One ThinkSpace.
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
