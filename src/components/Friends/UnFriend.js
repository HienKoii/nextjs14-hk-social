import { useFriends } from "@/src/context/FriendsContext";
import { useNotifications } from "@/src/context/NotificationsContext";
import { useUser } from "@/src/context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "react-bootstrap";
import { FaUserMinus } from "react-icons/fa";

export default function UnFriends({ friendId, className, as, sizeIcon, findFriends }) {
  const { getFriendsList, getSuggestedFriends } = useFriends();
  const handleUnfriend = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(`/api/friends/unfriend/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token của bạn
        },
      });
      if (response.data) {
        findFriends = true;
        getFriendsList();
        getSuggestedFriends();
      }
      console.log("Xử lý hủy kết bạn>> ", response.data);
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error.response?.data.message || error.message);
    }
  };

  return (
    <Button
      as={as}
      variant="secondary" //
      className={className}
      onClick={() => handleUnfriend()}
    >
      <FaUserMinus className="me-1" size={sizeIcon} />
      <span>Hủy kết bạn</span>
    </Button>
  );
}
