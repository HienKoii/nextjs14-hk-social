import React, { useState, useEffect, useRef } from "react";
import { MessageBox } from "react-chat-elements";
import dynamic from "next/dynamic";
import { Dropdown } from "react-bootstrap"; // Import Dropdown từ react-bootstrap

import ImagesAvatar from "../Images/ImagesAvatar";
import { useMessages } from "@/src/context/MessagesContext";
import { useUser } from "@/src/context/UserContext";
import { Download } from "yet-another-react-lightbox/plugins";
import ImagesLoading from "../Images/ImagesLoading";
import MessagesDropdown from "./MessagesDropdown";

// Dynamic import của Lightbox để hỗ trợ Next.js
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

export default function MessagesBoxView({ userChat }) {
  const { messages, loading } = useMessages(); // Thêm hàm xóa, sửa tin nhắn từ context
  const { user } = useUser();

  const [open, setOpen] = useState(false); // Điều khiển mở Lightbox
  const [currentImage, setCurrentImage] = useState(""); // Hình ảnh hiện tại

  const chatBoxEndRef = useRef(null); // Tạo ref để theo dõi phần tử cuối cùng trong danh sách tin nhắn

  // Cuộn tới cuối khi lần đầu load tin nhắn
  useEffect(() => {
    if (chatBoxEndRef.current) {
      chatBoxEndRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn mượt mà
    }
  }, [messages]); // Mỗi khi messages thay đổi, cuộn đến cuối

  const handleImageClick = (imageUri) => {
    setCurrentImage(imageUri);
    setOpen(true); // Mở Lightbox khi người dùng nhấp vào ảnh
  };

  return (
    <div className="chat-box h-100 pt-3 px-2" style={{ maxHeight: "88vh", overflowY: "scroll" }}>
      {loading ? (
        <ImagesLoading />
      ) : (
        <>
          {messages.map((msg, index) => (
            <div
              key={index} //
              className={`hk-msg-item ${msg.sender_id === user?.id ? "justify-content-end" : "justify-content-start"} mb-2`}
            >
              {/* Avatar bên trái (của bạn bè) */}
              {msg.sender_id !== user?.id && (
                <ImagesAvatar
                  id={userChat?.id} // Avatar của người bạn
                  url={userChat?.avatar} // URL ảnh đại diện người bạn
                  isCircle
                  className="me-2"
                  style={{ width: "40px", height: "40px" }} // Tuỳ chỉnh kích thước avatar
                />
              )}

              <div className="d-flex align-items-center">
                {/* Dropdown dấu 3 chấm */}
                {msg.sender_id === user?.id && !msg.is_deleted && <MessagesDropdown messageId={msg.id} currentContent={msg.content} />}

                {/* Message Box */}
                <MessageBox
                  className={`custom-message-box ${msg.img ? "hk-photo" : "hk-text"} ${msg.is_deleted ? "hk-text-deleted" : ""}`}
                  position={msg.sender_id === user?.id ? "right" : "left"} //
                  type={msg.img && !msg.is_deleted ? "photo" : "text"}
                  text={msg.is_deleted ? "Tin nhắn đã được xóa" : msg.content}
                  data={msg.img && !msg.is_deleted ? { uri: `/uploads/chat/${msg.img}` } : undefined} // Kiểm tra ảnh
                  date={new Date(msg.created_at)}
                  onClick={() => msg.img && !msg.is_deleted && handleImageClick(`/uploads/chat/${msg.img}`)} // Bắt sự kiện click vào ảnh
                />
              </div>

              {/* Avatar bên phải (của người dùng hiện tại) */}
              {msg.sender_id === user?.id && (
                <ImagesAvatar
                  id={user.id} // Avatar của người dùng
                  url={user.avatar} // URL ảnh đại diện người dùng
                  isCircle
                  className="ms-2"
                  style={{ width: "40px", height: "40px" }} // Tuỳ chỉnh kích thước avatar
                />
              )}
            </div>
          ))}
        </>
      )}

      {/* Lightbox để hiển thị ảnh */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Download]}
        slides={[{ src: currentImage }]} // Hiển thị ảnh đã được click
      />

      {/* Thẻ này là nơi cuối cùng trong danh sách tin nhắn để cuộn tới */}
      <div ref={chatBoxEndRef}></div>
    </div>
  );
}
