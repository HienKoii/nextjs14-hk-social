"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { Form, Button, Image } from "react-bootstrap";
import ImagesAvatar from "@/src/components/Images/ImagesAvatar";
import { useUser } from "@/src/context/UserContext";
import { FaArrowLeft, FaImage, FaPaperPlane, FaSmile, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import Link from "next/link";

import { socket } from "@/src/socket";
import { useMessages } from "@/src/context/MessagesContext";
import MessagesBoxView from "@/src/components/messages/MessagesBoxView";

export default function MessageId() {
  const { ID } = useParams();

  const { fetchUserById } = useUser();
  const { fetchChatData, markMessagesAsRead, handleSendMessage } = useMessages();

  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const [selectedImage, setSelectedImage] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [userChat, setUserChat] = useState(null); // Thông tin của người bạn đang chat

  const fileInputRef = useRef(null);

  // Xử lý chọn emoji
  const onEmojiClick = (emojiData) => {
    setNewMessage((prevInput) => prevInput + emojiData.emoji);
  };

  useEffect(() => {
    // Fetch thông tin của người bạn và tin nhắn khi load page
    if (ID) {
      const fetchUserChat = async () => {
        try {
          const res = await fetchUserById(ID);
          console.log(" lấy thông tin người chat ", res.data);
          setUserChat(res.data);
        } catch (error) {
          console.log("Lỗi lấy thông tin người chat ", error);
        }
      };

      fetchUserChat();
      markMessagesAsRead(ID);
      fetchChatData(ID);
    }
  }, [ID]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Hàm xử lý gửi tin nhắn
  const handleSubmit = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (newMessage.trim() === "") return alert("Vui lòng nhập tin nhắn");

      try {
        // Gửi tin nhắn mới lên server
        const dataMessage = {
          receiverId: ID,
          content: newMessage,
          selectedImage,
        };

        const response = await handleSendMessage(dataMessage);
        console.log("Gửi tin nhắn mới lên server: ", response);
        // Cập nhật giao diện với tin nhắn mới
        socket.emit("get_message", { receiverId: Number(ID) });
        setNewMessage("");
        setShowPicker(false);
        setSelectedImage(null);
        if (response.status === 201) {
          fetchChatData(ID);
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Xóa ảnh đã chọn bằng cách đặt lại state thành null
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Đặt lại giá trị của input file
    }
  };

  return (
    <div className="w-100 h-100 bg-white hk-message">
      <div className="h-100 hk-message-wrapper">
        {/* Header với thông tin */}
        {userChat && (
          <div className="hk-mess-header gap-1 p-2">
            <Link href={"/message"} className="hk-fa-arrowLeft">
              <FaArrowLeft />
            </Link>
            <div>
              <ImagesAvatar id={userChat.id} url={userChat.avatar} isCircle />
              <strong>{userChat.fullName}</strong>
            </div>
          </div>
        )}
        <MessagesBoxView userChat={userChat} />
        <Form className="px-2 mb-2 gap-2 hk-mess-footer" onSubmit={(e) => e.preventDefault()}>
          {/* Nút tải ảnh */}
          <Button variant="primary" as="label" htmlFor="upload-photo" style={{ cursor: "pointer" }}>
            <FaImage size={22} /> {/* Biểu tượng tải ảnh */}
          </Button>
          <input
            type="file"
            id="upload-photo"
            style={{ display: "none" }} // Ẩn input để chỉ hiển thị nút
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e)}
          />
          <>{/* Hiển thị ảnh đã chọn nếu có */}</>
          <Button variant="primary" onClick={() => setShowPicker(!showPicker)}>
            <FaSmile size={22} />
          </Button>
          <>
            {selectedImage && (
              <div className="selected-image-preview my-2" style={{ position: "relative", display: "inline-block" }}>
                <Image
                  src={URL.createObjectURL(selectedImage)} //
                  alt="Preview"
                  fluid
                  style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                />

                {/* Icon xóa ảnh */}
                <FaTimes
                  size={18}
                  color="red"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                  onClick={() => handleRemoveImage()}
                />
              </div>
            )}
          </>

          {/* Phần textarea nằm dưới */}
          <Form.Control
            as="textarea" // Chuyển sang sử dụng textarea
            rows={1} // Số dòng mặc định
            placeholder="Nhập tin nhắn..." //
            aria-label="msg"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
                handleSubmit(); // Gửi tin nhắn khi nhấn Enter
              }
            }}
            className="bg-light"
            style={{ borderRadius: "22px", resize: "none", overflow: "hidden" }} // Tắt chức năng resize và ẩn overflow
            onInput={(e) => {
              e.target.style.height = "auto"; // Đặt chiều cao về auto để tính toán chính xác
              e.target.style.height = `${e.target.scrollHeight}px`; // Thiết lập chiều cao dựa trên scrollHeight
            }}
          />

          <Button variant="primary" onClick={handleSubmit}>
            <FaPaperPlane size={22} />
          </Button>
          {showPicker && (
            <div className="emoji-picker" style={{ position: "absolute", bottom: "60px", left: "20px" }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
