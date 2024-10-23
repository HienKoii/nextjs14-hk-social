"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useUser } from "./UserContext";
import { socket } from "../socket";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const token = Cookies.get("token");
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const getFriendsList = async () => {
    // lấy danh sách bạn bè
    if (!token) return;
    try {
      const response = await axios.get("/api/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("lấy danh sách bạn bè", response.data.friends);

      setFriends(response.data.friends);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè:", error.response ? error.response.data.message : error.message);
    }
  };

  // Lấy gợi ý kết bạn
  const getSuggestedFriends = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/api/friends/suggested", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuggestedFriends(response.data.suggestedFriends);
      console.log("Lấy gợi ý kết bạn", response.data.suggestedFriends);
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý kết bạn:", error.response ? error.response.data.message : error.message);
    }
  };

  const fetchFriendRequests = async () => {
    if (!token) return;
    try {
      // Gọi API để lấy danh sách yêu cầu kết bạn
      const response = await axios.get("/api/friend-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFriendRequests(response.data.requests); // Cập nhật danh sách yêu cầu kết bạn
      console.log("lấy danh sách yêu cầu kết bạn", response.data.requests);
    } catch (error) {
      console.error("Lỗi lấy yêu cầu kết bạn:", error);
    } finally {
    }
  };

  useEffect(() => {
    socket.on("receive_friends-requests", (data) => {
      fetchFriendRequests();
    });

    getFriendsList();
    getSuggestedFriends();
    fetchFriendRequests();

    return () => {
      socket.off("receive_friends-requests");
    };
  }, [token, user]);

  const values = { getFriendsList, friends, suggestedFriends, getSuggestedFriends, fetchFriendRequests, friendRequests };
  return <FriendsContext.Provider value={values}>{children}</FriendsContext.Provider>;
};

export const useFriends = () => {
  return useContext(FriendsContext);
};
