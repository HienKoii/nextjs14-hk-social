"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { socket } from "../socket";

const CommentsContext = createContext();

export const CommentsProvider = ({ selectedPost, children }) => {
  const token = Cookies.get("token");

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    if (selectedPost) {
      try {
        const response = await axios.get(`/api/comments/${selectedPost.id}`);
        console.log("Lấy bình luận: ", response.data.comments);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [selectedPost, token]);

  const handleAddComment = async (data) => {
    try {
      if (!token) return;
      const response = await axios.post("/api/comments/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        fetchComments();
        socket.emit("get_notifications", { receiverId: response.data.receiverId });
      }
      console.log("Thêm bình lận: ", response.data);
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      throw error;
    }
  };

  const values = { loading, selectedPost, comments, handleAddComment, fetchComments };
  return <CommentsContext.Provider value={values}>{children}</CommentsContext.Provider>;
};

export const useComments = () => {
  return useContext(CommentsContext);
};
