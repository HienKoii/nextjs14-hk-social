import axios from "axios";
import React from "react";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";

import { useFriends } from "@/src/context/FriendsContext";
import { FaUserCheck } from "react-icons/fa";
import { socket } from "@/src/socket";

export default function AcceptFriends({ requestId, senderId, isIcon = false, sizeIcon, className }) {
  const { fetchFriendRequests, getFriendsList } = useFriends();

  const acceptFriendRequest = async () => {
    const token = Cookies.get("token");
    try {
      if (!token) return;
      const response = await axios.put(
        "/api/friend-requests",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        fetchFriendRequests();
        getFriendsList();
        socket.emit("get_notifications", { receiverId: response.data.receiverId });
      }
      alert(response.data.message);

      console.log("Xử lý chập nhận bạn bè", response.data.message);

      return response.data;
    } catch (error) {
      console.error("Lỗi:", error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <>
      <Button variant="primary" className={className} onClick={() => acceptFriendRequest()}>
        {isIcon && <FaUserCheck size={sizeIcon} />} <span> Chấp chận</span>
      </Button>
    </>
  );
}
