import { useUser } from "@/src/context/UserContext";
import { isToken } from "@/src/utils";
import Link from "next/link";
import { Image } from "react-bootstrap";
import ImagesAvatar from "../Images/ImagesAvatar";
import AddFriends from "../Friends/AddFriends";

export default function ReactionsListUser({ data }) {
  const { user } = useUser();

  return (
    <div className="d-flex justify-content-between align-items-center">
      <Link
        href={`/profile/${data?.user_id}`} //
        className="d-flex justify-content-start align-items-center mb-2 gap-2"
      >
        <div style={{ position: "relative" }}>
          <ImagesAvatar id={data?.user_id} url={data?.avatar} isCircle className={"object-fit-cover"} />
          <Image
            src={`/images/${data.type}.svg`} // Sử dụng data.type
            alt={data.type}
            width={16}
            height={"auto"}
            style={{ position: "absolute", right: "0px", bottom: "0px" }}
          />
        </div>

        <div className="d-flex justify-content-start align-items-center gap-1">
          <span className="fw-bold"> {data.fullName}</span>
          {data.tick ? (
            <Image
              src={`/images/tick.png`} //
              alt="Avatar"
              width={15}
              className="rounded-circle"
            />
          ) : null}
        </div>
      </Link>
      {isToken() && <>{user?.id !== data.user_id && <AddFriends friendId={data.user_id} className={""} />}</>}
    </div>
  );
}
