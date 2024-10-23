// app/api/friends/unfriend/[friendID]/route.js
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Handler DELETE để hủy kết bạn
export async function DELETE(req, { params }) {
  let connection;
  const { friendID } = params; // Lấy friendID từ URL params
  console.log('friendID', friendID)

  try {
    // Lấy token từ header Authorization
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Không có token." }), { status: 401 });
    }

    // Giải mã token để lấy userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kết nối cơ sở dữ liệu
    connection = await db.getConnection();

    // Kiểm tra xem mối quan hệ bạn bè có tồn tại hay không
    const [friendship] = await connection.query(
      `SELECT * FROM friends WHERE 
        (user_id = ? AND friend_id = ? AND status = 'accepted') 
        OR (user_id = ? AND friend_id = ? AND status = 'accepted')`,
      [userId, friendID, friendID, userId]
    );

    if (friendship.length === 0) {
      return new Response(JSON.stringify({ message: "Không tìm thấy mối quan hệ bạn bè." }), { status: 404 });
    }

    // Xóa mối quan hệ bạn bè
    await connection.query(
      `DELETE FROM friends WHERE 
        (user_id = ? AND friend_id = ?) 
        OR (user_id = ? AND friend_id = ?)`,
      [userId, friendID, friendID, userId]
    );

    return new Response(JSON.stringify({ message: "Đã hủy kết bạn thành công." }), { status: 200 });
  } catch (error) {
    console.error("Lỗi khi hủy kết bạn:", error);
    return new Response(JSON.stringify({ message: "Lỗi khi hủy kết bạn." }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
