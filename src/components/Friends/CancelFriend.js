import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "react-bootstrap";
import { FaUserTimes } from "react-icons/fa";

export default function CancelFriend({ receiverId, className, as, sizeIcon, setIsFriendRequestPending }) {
  const handleCancelFriendRequest = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(`/api/friend-requests/cancel/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      setIsFriendRequestPending(false);
      alert(response.data.message);
      console.log("Hủy lời mời kết bạn: ", response.data); // Thông báo thành công
    } catch (error) {
      console.error("Lỗi hủy lời mời kết bạn: ", error); // Thông báo thành công
    }
  };

  return (
    <Button
      as={as}
      variant="secondary" //
      className={className}
      onClick={() => handleCancelFriendRequest()}
    >
      <FaUserTimes className="me-1" size={sizeIcon} />
      <span>Hủy lời mời</span>
    </Button>
  );
}
