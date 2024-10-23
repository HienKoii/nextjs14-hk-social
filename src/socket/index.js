"use client";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

// Tạo socket với hàm khởi tạo và truyền token động
export const socket = io({
  autoConnect: false, // Ngăn việc tự động kết nối khi khởi tạo socket
});

// Hàm để thiết lập kết nối với token mới nhất
export const connectSocket = () => {
  const token = Cookies.get("token");
  if (token) {
    // Đặt lại query với token mới nhất
    socket.io.opts.query = { token };
    socket.connect(); // Kết nối socket sau khi đã có token
  }
};

// Hàm ngắt kết nối khi cần
export const disconnectSocket = () => {
  socket.disconnect();
};
