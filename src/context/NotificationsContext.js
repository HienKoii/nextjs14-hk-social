"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { socket } from "../socket";
import { convertContentNotifications } from "../utils";

const NotificationsContext = createContext();
export default function NotificationsProvider({ children }) {
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [isCall, setIsCall] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  const fetchNotifications = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const response = await axios.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      const newNotifications = response?.data?.notifications?.map((item) => {
        return {
          ...item,
          content: `vừa ${convertContentNotifications(item.type)}`,
        };
      });
      console.log("Lấy thông báo: ", {
        ...response.data,
        newNotifications,
      });
      setNotifications(newNotifications);
      setUnreadNotifications(response.data.unreadNotifications);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật trạng thái is_read của thông báo
  const markAllNotificationsAsRead = async () => {
    if (unreadNotifications && isCall && unreadNotifications.length > 0) {
      try {
        const response = await axios.put(
          "/api/notifications",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        );
        console.log("Cập nhật trạng thái của thông báo:", response.data);
        if (response.status === 200) {
          setIsCall(false);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thông báo:", error.response?.data?.message || error.message);
      }
    }
  };

  const fetchUnreadMessages = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const response = await axios.get("/api/messages/unread", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      setUnreadMessages(response.data.unreadMessages);
      console.log("Lấy tin nhắn chưa đọc>>> ", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện nhận thông báo
    socket.on("receive_notifications", (data) => {
      fetchNotifications();
    });
    // Lắng nghe sự kiện nhận tin nhắn mới
    socket.on("receive_message", (data) => {
      fetchUnreadMessages();
    });

    fetchNotifications();
    fetchUnreadMessages();
    return () => {
      socket.off("receive_notifications");
      socket.off("receive_message");
    };
  }, [token]);

  const values = { loading, notifications, unreadNotifications, markAllNotificationsAsRead, unreadMessages, fetchUnreadMessages };
  return <NotificationsContext.Provider value={values}>{children}</NotificationsContext.Provider>;
}
export const useNotifications = () => {
  return useContext(NotificationsContext);
};
