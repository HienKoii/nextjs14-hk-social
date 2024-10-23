"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { useNotifications } from "./NotificationsContext";
import { useUser } from "./UserContext";

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const token = Cookies.get("token");

  const { user } = useUser();
  const { fetchUnreadMessages } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [listChatUsers, setListChatUsers] = useState([]); // danh sách người nhắn tin
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn

  const fetchChatUsers = async () => {
    try {
      const response = await axios.get("/api/messages/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Danh sách người đã nhắn tin:", response.data.chatUsers);
      if (response.data.chatUsers) {
        setListChatUsers(response.data.chatUsers);
      } else {
        console.error("Không có danh sách người đã nhắn tin:", response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người nhắn tin:", error);
    }
  };

  // Fetch thông tin của người bạn và tin nhắn khi load page
  const fetchChatData = async (id) => {
    if (!token) return;
    setLoading(true);
    try {
      // Lấy tin nhắn giữa bạn và người đó
      const messagesResponse = await axios.get(`/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      console.log("Lấy tin nhắn giữa bạn và người đó: ", messagesResponse.data.messages);

      setMessages(messagesResponse.data.messages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu trò chuyện:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (id) => {
    try {
      const data = {
        senderId: Number(id),
        receiverId: user.id,
      };
      const response = await axios.put("/api/messages/unread", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      if (response.status === 200) {
        fetchUnreadMessages();
      }
      console.log("Cập nhật trạng thái tin nhắn:", response.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật tin nhắn:", error);
    }
  };

  const handleSendMessage = async (data) => {
    try {
      const formData = new FormData();
      formData.append("receiverId", data.receiverId);
      formData.append("content", data.content);
      formData.append("img", data.selectedImage || []);

      const response = await axios.post("/api/messages/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      if (response.status === 201) {
        // setMessages((prev) => [
        //   ...prev,
        //   {
        //     sender_id: user?.id, // Bạn là người gửi
        //     content: data.content,
        //     img: response.data.img,
        //     created_at: new Date().toISOString(),
        //   },
        // ]);
      }

      console.log("Gửi tin nhắn mới lên server: ", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };
  useEffect(() => {
    fetchChatUsers();
  }, [token]);

  const values = { listChatUsers, loading, messages, setMessages, fetchChatData, markMessagesAsRead, handleSendMessage };
  return <MessagesContext.Provider value={values}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  return useContext(MessagesContext);
};
