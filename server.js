import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const connectedUsers = {}; // Đối tượng lưu trữ các socket đang kết nối

// Hàm thêm người dùng vào kết nối
function addUserSocket(userId, socketId) {
  connectedUsers[userId] = socketId; // Thêm socketId của người dùng vào đối tượng
}
function findSocketIdByUserId(userId) {
  return connectedUsers[userId] || null; // Giả sử bạn đã lưu socketId trong connectedUsers
}
// Hàm xóa người dùng khi ngắt kết nối
function removeUserSocket(userId) {
  delete connectedUsers[userId]; // Xóa socketId của người dùng khỏi đối tượng
}

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Điều chỉnh cho phù hợp với nhu cầu bảo mật của bạn
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.query.token; // Nhận token từ query string

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác minh token
      const userId = decoded.userId; // Giả sử token chứa userId
      addUserSocket(userId, socket.id); // Thêm socketId vào danh sách kết nối
      console.log(`ID người kết nối: ${userId}, Socket ID: ${socket.id}`); // Log userId khi người dùng kết nối

      // Sự kiện lấy tất cả người dùng kết nối
      socket.on("get_connected_users", () => {
        // Gửi danh sách người dùng đang kết nối cho client
        socket.emit("connected_users", connectedUsers);
      });

      // Sự kiện nhận thông báo khi tạo thông báo
      socket.on("get_message", (data) => {
        console.log("get_message data: ", data);

        const findReceiverId = findSocketIdByUserId(data.receiverId); // Tìm socket ID của người nhận

        // Kiểm tra xem tìm thấy socket ID không
        if (findReceiverId) {
          // Gửi thông báo đến người nhận qua socket ID
          console.log("findReceiverId", findReceiverId);

          io.to(findReceiverId).emit("receive_message", {
            msg: `Bạn có thông báo mới từ người dùng: ${data.receiverId}`,
          });
          console.log(`Thông báo đã được gửi cho userId: ${data.receiverId}`);
        } else {
          console.log(`Không tìm thấy socket cho userId: ${data.receiverId}`);
        }
      });

      // Sự kiện nhận thông báo khi tạo thông báo
      socket.on("get_notifications", (data) => {
        const findReceiverId = findSocketIdByUserId(data.receiverId); // Tìm socket ID của người nhận

        // Kiểm tra xem tìm thấy socket ID không
        if (findReceiverId) {
          // Gửi thông báo đến người nhận qua socket ID
          io.to(findReceiverId).emit("receive_notifications", {
            msg: `Bạn có thông báo mới từ người dùng: ${data.receiverId}`,
          });
          console.log(`Thông báo đã được gửi cho userId: ${data.receiverId}`);
        } else {
          console.log(`Không tìm thấy socket cho userId: ${data.receiverId}`);
        }
      });

      socket.on("get_friends-requests", (data) => {
        console.log("get_friends-requests", data);
        const findReceiverId = findSocketIdByUserId(data.receiverId); // Tìm socket ID của receiverId

        // Kiểm tra xem tìm thấy socket ID không
        if (findReceiverId) {
          // Gửi thông báo đến người nhận yêu cầu kết bạn
          io.to(findReceiverId).emit("receive_friends-requests", {
            msg: "Bạn có một yêu cầu kết bạn từ user ID: " + data.sendId,
          });
          console.log(`Gửi yêu cầu kết bạn cho người dùng: ${data.receiverId} từ ${data.sendId}`);
        } else {
          console.log(`Không tìm thấy socket cho userId: ${data.receiverId}`);
        }
      });

      socket.on("disconnect", () => {
        console.log(`Người dùng ngắt kết nối: ${userId}, Socket ID: ${socket.id}`);
        removeUserSocket(userId); // Xóa socketId khỏi danh sách khi ngắt kết nối
      });
    } catch (error) {
      // console.error("Token không hợp lệ:", error);
      socket.disconnect(); // Ngắt kết nối nếu token không hợp lệ
    }
  });

  httpServer
    .once("error", (err) => {
      console.error("Lỗi khi khởi động server:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
