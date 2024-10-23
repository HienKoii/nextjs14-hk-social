"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { connectSocket, disconnectSocket, socket } from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [listUserOnline, setListUserOnline] = useState([]);

  useEffect(() => {
    if (token) {
      // Kết nối socket với token
      connectSocket();

      function onConnect() {
        console.log("Kết nối socket thành công!");

        // Gửi yêu cầu lấy danh sách người dùng đang kết nối
        socket.emit("get_connected_users");

        // Lắng nghe sự kiện lấy danh sách người dùng kết nối
        socket.on("connected_users", (users) => {
          setListUserOnline(users);
          console.log("Danh sách người dùng đang kết nối:", users);
        });
      }

      function onDisconnect() {
        console.log("Socket đã ngắt kết nối.");
      }

      // Lắng nghe sự kiện kết nối và ngắt kết nối
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      // Cleanup khi component unmount hoặc token thay đổi
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("connected_users");
        disconnectSocket();
      };
    } else {
      console.log("Không có token, không kết nối socket.");
      disconnectSocket(); // Ngắt kết nối nếu không có token
    }
  }, [token]);

  const values = { listUserOnline };

  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};
