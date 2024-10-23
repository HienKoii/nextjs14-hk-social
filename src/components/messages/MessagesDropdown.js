import React, { useState } from "react";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaEllipsisH, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import axios from "axios";
import { useMessages } from "@/src/context/MessagesContext";
import { useParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker

export default function MessagesDropdown({ messageId, currentContent }) {
  const token = Cookies.get("token");
  const { ID } = useParams();
  const { fetchChatData, setMessages } = useMessages();

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editedMessage, setEditedMessage] = useState(currentContent);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to control emoji picker

  const handleDeleteMessage = async (id, type) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa tin nhắn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/api/messages/action/${id}/${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Xử lý xóa tin nhắn >>>", response);

        if (response.status === 200) {
          fetchChatData(ID);
          Swal.fire("Đã xóa!", "Tin nhắn đã được xóa.", "success");
        }
      } catch (error) {
        console.error("Lỗi khi xóa tin nhắn:", error);
      }
    }
  };

  const handleEditMessage = async (id, content) => {
    try {
      const response = await axios.patch(
        `/api/messages/edit/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      if (response.status === 200) {
        console.log("Tin nhắn đã được sửa.");
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === id ? { ...msg, content } : msg))
        );
      }
    } catch (error) {
      console.error("Lỗi khi sửa tin nhắn:", error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setEditedMessage((prev) => prev + emojiObject.emoji); // Add emoji to the message
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  return (
    <>
      <Dropdown className="ms-2">
        <Dropdown.Toggle as={"div"} id="dropdown-basic" size="sm" className="no-caret hk-msg-dropdown">
          <FaEllipsisH />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* Dropdown item with edit icon */}
          <Dropdown.Item className="hk-center" onClick={() => setShowModal(true)}>
            <FaEdit className="me-2" /> Sửa
          </Dropdown.Item>

          {/* Dropdown item with delete icon */}
          <Dropdown.Item className="hk-center" onClick={() => handleDeleteMessage(messageId, "is_deleted")}>
            <FaTrash className="me-2" /> Xóa
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Modal for editing message */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Tin Nhắn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicMessage">
              <Form.Label>Nội dung tin nhắn</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  placeholder="Nhập nội dung mới"
                />
                <Button
                  variant="light"
                  className="ms-2"
                  onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle emoji picker
                >
                  😀
                </Button>
              </div>
              {showEmojiPicker && (
                <div className="mt-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleEditMessage(messageId, editedMessage)}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
