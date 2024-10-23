import { useFriends } from "@/src/context/FriendsContext";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "react-bootstrap";
import { FaUserTimes } from "react-icons/fa";

export default function RejectFriends({ senderId, className, as, sizeIcon, isIcon = false }) {
  const { fetchFriendRequests } = useFriends();
  const handleRejectFriendRequest = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(`/api/friend-requests/reject/${senderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      fetchFriendRequests();
      console.log("Từ chối lời mời kết bạn: ", response.data); // Thông báo thành công
    } catch (error) {
      console.error("Lỗi Từ chối mời kết bạn: ", error); // Thông báo thành công
    }
  };

  return (
    <Button
      as={as}
      variant="secondary" //
      className={className}
      onClick={() => handleRejectFriendRequest()}
    >
      {isIcon && <FaUserTimes className="me-1" size={sizeIcon} />}
      <span>Từ chối</span>
    </Button>
  );
}
