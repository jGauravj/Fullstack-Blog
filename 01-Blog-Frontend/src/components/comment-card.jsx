import { getDay } from "../common/date";

const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personal_info: { fullname, username, profile_img },
    },
    commentedAt,
    comment,
  } = commentData;

  // let { username, profile_img, fullname } = commented_by?.personal_info || {};

  return (
    <div className="w-full mb-5 " style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey ">
        <div className="flex gap-3 items-center mb-4">
          <div className="flex items-center gap-1.5">
            <img
              src={profile_img}
              alt="profile_img"
              className=" size-6 rounded-full"
            />
            <p className="line-clamp-1 text-dark-grey text-sm">
              {fullname} @{username}
            </p>
          </div>
          <p className="text-sm text-dark-grey min-w-fit">
            {getDay(commentedAt)}
          </p>
        </div>
        <p className="font-gelasio text-base">{comment}</p>
        <div></div>
      </div>
    </div>
  );
};

export default CommentCard;
