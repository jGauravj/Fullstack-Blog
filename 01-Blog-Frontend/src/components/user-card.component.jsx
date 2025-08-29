import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  let {
    personal_info: { fullname, username, profile_img },
  } = user;

  return (
    <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
      <img
        src={profile_img}
        alt="profile_img"
        className="md:w-13 md:h-13 w-11 h-11 rounded-full"
      />
      <div>
        <h1 className="font-medium md:text-lg text-base line-clamp-2">
          {fullname}
        </h1>
        <p className="text-dark-grey sm:text-base text-xs">@{username}</p>
      </div>
    </Link>
  );
};

export default UserCard;
