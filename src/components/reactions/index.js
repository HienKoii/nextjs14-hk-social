import React, { useState } from "react";
import { Button, Image } from "react-bootstrap";
import { AiOutlineLike } from "react-icons/ai";
import Cookies from "js-cookie";
import axios from "axios";
import { socket } from "@/src/socket";

// Available reactions
const reactions = [
  { type: "like", label: "Thích" },
  { type: "love", label: "Yêu thích" },
  { type: "lovelove", label: "Thương thương" },
  { type: "haha", label: "Haha" },
  { type: "wow", label: "Wow" },
  { type: "sad", label: "Buồn" },
  { type: "angry", label: "Giận dữ" },
];

export default function Reactions({ post, handleTotalReactions, handleReactionsData }) {
  const [isHolding, setIsHolding] = useState(false);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  // console.log("userReaction", userReaction);

  const token = Cookies.get("token");

  // Handle reaction click
  const handleReactionClick = async (type) => {
    try {
      if (!token) {
        return alert("Vui lòng đăng nhập trước");
      }

      if (!isHolding) return;
      const data = {
        post_id: post.id,
        type: type,
      };

      const response = await axios.post("/api/reactions", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsHolding(false);

      switch (response.data.status) {
        case "INSERT":
          handleTotalReactions(1);
          break;
        case "DELETE":
          handleTotalReactions(-1);
          break;
      }
      socket.emit("get_notifications", { receiverId: response.data.receiverId });
      setUserReaction(response.data.data.type);
      handleReactionsData(response.data);
      setIsHolding(false);
      // console.log("response handleReactionClick", response.data);
    } catch (error) {
      console.error("Lỗi khi thả cảm xúc:", error);
    }
  };

  return (
    <div className="position-relative d-inline-block w-100">
      {/* Nút Thích */}
      <Button
        variant={userReaction ? "secondary" : "light"}
        className="d-flex align-items-center justify-content-center w-100 hk-custom-btn"
        onClick={() => handleReactionClick("like")}
        onMouseEnter={() => setIsHolding(true)}
        onMouseLeave={() => setIsHolding(false)}
      >
        {userReaction ? (
          <Image src={`/images/${userReaction}.svg`} alt={userReaction} width={25} height={"auto"} className="reaction-img" />
        ) : (
          <>
            <AiOutlineLike className="me-1" /> Thích
          </>
        )}
      </Button>

      {/* Khối popup luôn được render nhưng điều khiển hiển thị bằng CSS */}
      <div
        className="reaction-popup bg-light"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
          opacity: isHolding ? 1 : 0, // Thay đổi độ mờ khi hover
          visibility: isHolding ? "visible" : "hidden", // Điều khiển hiển thị
          transform: isHolding ? "translateY(0)" : "translateY(20px)", // Thêm hiệu ứng di chuyển
          transition: "opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease", // Hiệu ứng mượt mà
        }}
        onMouseEnter={() => setIsHolding(true)} // Giữ popup khi hover vào
        onMouseLeave={() => setIsHolding(false)} // Ẩn khi rời khỏi popup
      >
        {reactions.map((reaction, index) => (
          <div key={index} onClick={() => handleReactionClick(reaction.type)} style={{ cursor: "pointer" }}>
            <Image src={`/images/${reaction.type}.svg`} alt={reaction.label} width={35} height={"auto"} className={`reaction-img`} />
          </div>
        ))}
      </div>
    </div>
  );
}
