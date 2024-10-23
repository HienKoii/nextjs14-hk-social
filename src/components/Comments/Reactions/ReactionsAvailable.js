import React, { useState } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

import { AvailableReactions } from "@/src/utils";
import { useComments } from "@/src/context/CommentsContext";

export default function ReactionsAvailable({ commentId }) {
  const [holdingState, setHoldingState] = useState(Array(AvailableReactions.length).fill(false));
  const { fetchComments } = useComments();

  const handleMouseEnter = (index) => {
    setHoldingState((prevState) => prevState.map((isHolding, i) => (i === index ? true : isHolding)));
  };

  const handleMouseLeave = (index) => {
    setHoldingState((prevState) => prevState.map((isHolding, i) => (i === index ? false : isHolding)));
  };

  const handleReaction = async (type, index) => {
    try {
      const token = Cookies.get("token");
      if (!token) return alert("vui lòng đăng nhập");

      const data = { comment_id: commentId, type };
      const response = await axios.post(`/api/comments/reactions`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleMouseLeave(index);
      fetchComments();
      console.log("Thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi thả cảm xúc:", error);
    }
  };

  return (
    <>
      {AvailableReactions.map((reaction, index) => (
        <div key={index}>
          <Image
            src={`/images/${reaction.type}.svg`}
            alt={reaction.label}
            width={35}
            height={"auto"}
            className="reaction-img"
            onMouseEnter={() => handleMouseEnter(index)} // Gọi khi hover vào
            onMouseLeave={() => handleMouseLeave(index)} // Gọi khi hover out
            onClick={() => handleReaction(reaction.type, index)} // Gọi khi click vào biểu tượng cảm xúc
            style={{
              transform: holdingState[index] ? "translateY(-50%)" : null, // Chỉ áp dụng khi isHolding là true cho index đó
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      ))}
    </>
  );
}
