import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { FaCog, FaTrash, FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";

import { useUser } from "@/src/context/UserContext";

export default function ImagesDropdown({ data, item }) {
  const token = Cookies.get("token");
  const { fetchUserData, fetchImgsUerId } = useUser();

  const type = data?.type;
  const userId = data?.userId;
  const imagePath = data?.url[item];

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `/api/user/imgs/set/${type}/${userId}`,
        { imagePath },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        fetchUserData();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh:", error);
    }
  };

  const deleteImage = async () => {
    try {
      const response = await axios.delete(`/api/user/imgs/delete/${type}/${userId}/${imagePath}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token nếu cần
        },
      });
      if (response.data) {
        fetchImgsUerId(type, userId);
      }
      console.log("Xóa ảnh thành công:", response.data);
    } catch (error) {
      console.log("Lỗi xóa ảnh", error);
    }
  };

  return (
    <Dropdown style={{ position: "absolute", top: 4, right: 7 }}>
      <Dropdown.Toggle variant="link" id="dropdown-basic" className="pt-0 pe-1 no-caret ">
        <FaCog />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item className="d-flex  align-items-center gap-1 mb-2" onClick={() => handleUpdate()}>
          <FaUserCircle size={20} />
          <span> Đặt làm ảnh đại diện </span>
        </Dropdown.Item>
        <Dropdown.Item className="d-flex align-items-center gap-1" onClick={() => deleteImage()}>
          <FaTrash size={20} />
          <span> Xóa </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
