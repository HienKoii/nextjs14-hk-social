"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { Button } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";

import { useFriends } from "@/src/context/FriendsContext";
import { isToken } from "@/src/utils";
import AcceptFriends from "./AcceptFriends";
import { socket } from "@/src/socket";

export default function AddFriends({ friendId, className, as, sizeIcon, setIsFriendRequestPending, isFriends }) {
  const pathname = usePathname();
  const isProfilePage = /^\/profile\/\w+$/.test(pathname);

  const { getSuggestedFriends } = useFriends();

  const sendRequest = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "/api/friend-requests",
        {
          receiverId: friendId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        if (isProfilePage) {
          setIsFriendRequestPending(true);
        } else {
          getSuggestedFriends();
        }
        socket.emit("get_notifications", { receiverId: response.data.receiverId });
        socket.emit("get_friends-requests", { receiverId: response.data.receiverId });
      }
      alert(response.data.message);
      console.log("Xử lý gửi yêu cầu kết bạn>>> ", response);
    } catch (error) {
      console.error("Lỗi gửi yêu cầu kết bạn:", error);
    }
  };

  return (
    <>
      {!isFriends ? (
        <Button
          as={as}
          variant="secondary" //
          className={className}
          onClick={() => sendRequest()}
          disabled={!isToken() ? true : false}
        >
          <FaUserPlus className="me-1" size={sizeIcon} />
          <span>Kết bạn</span>
        </Button>
      ) : (
        <>
          <AcceptFriends isIcon className={`w-100 d-flex justify-content-center align-items-center gap-2`} />
        </>
      )}
    </>
  );
}
