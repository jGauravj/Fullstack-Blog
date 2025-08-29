import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
  const [serachBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const navigate = useNavigate();

  const {
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  const handleUserNavPanel = () => {
    setUserNavPanel((currVal) => !currVal);
  };

  const handleSearchFun = (e) => {
    let query = e.target.value;
    if (e.keyCode == 13 && query.trim().length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-7.5 md:w-9">
          <img src={logo} alt="logo" className="w-full" />
        </Link>

        <div
          className={` absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:opacity-100 md:pointer-events-auto ${
            serachBoxVisibility ? "show" : "hide"
          } `}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearchFun}
          />
          <i className="fi fi-rr-search absolute right-[9%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 md:text-lg text-base text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          <button
            onClick={() => setSearchBoxVisibility((currVal) => !currVal)}
            className="md:hidden bg-grey w-10 h-10 rounded-full flex items-center justify-center"
          >
            <i className="fi fi-rr-search text-base text-dark-grey mt-1"></i>
          </button>

          <Link
            to="/editor"
            className="hidden md:flex md:items-center gap-2 link rounded-xl"
          >
            <i className="fi fi-rr-file-edit text-lg"></i>
            <p className="text-base">Write</p>
          </Link>

          {access_token ? (
            <>
              <Link to="/dashboard/notification">
                <button className="md:w-12 md:h-12 w-10 h-10 rounded-full bg-grey relative hover:bg-black/10 cursor-pointer group">
                  <i className="fi fi-rr-bell md:text-lg text-base block mt-2 text-dark-grey group-hover:text-black"></i>
                </button>
              </Link>

              <div
                className=" relative "
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="md:w-12 md:h-12 w-10 h-10 mt-1 cursor-pointer">
                  <img
                    src={profile_img}
                    alt="profile-img"
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                {userNavPanel ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-dark py-2">
                Sign In
              </Link>
              <Link to="/signup" className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
