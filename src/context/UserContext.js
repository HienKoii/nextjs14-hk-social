"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { socket } from "../socket";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [loadingImgs, setLoadingImgs] = useState(false);
  const [user, setUser] = useState(null);
  const [dataImgs, setDataImgs] = useState();

  const fetchUserData = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUserById = async (id) => {
    if (token) {
      try {
        const response = await axios.get(`/api/user/${id}`);
        return response;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    }
  };

  const fetchImgsUerId = async (type, userId) => {
    setLoadingImgs(true);
    try {
      const res = await axios.get(`/api/user/imgs/gets/${type}/${userId}`);
      setDataImgs(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy ảnh:");
    } finally {
      setLoadingImgs(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    socket.emit("logout");
    socket.disconnect();
  };

  const values = { user, setUser, handleLogout, loading, setLoading, fetchUserData, fetchImgsUerId, dataImgs, loadingImgs, fetchUserById };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
