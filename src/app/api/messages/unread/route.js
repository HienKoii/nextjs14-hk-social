// pages/api/messages/unread.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";

export async function GET(req) {
  let connection;

  try {
    // Xác thực token từ header
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực." }, { status: 401 });
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    connection = await db.getConnection();

    // Lấy danh sách tin nhắn chưa đọc cho người dùng
    const sql = `SELECT * FROM messages WHERE receiver_id = ? AND is_read = 0 ORDER BY created_at DESC`;
    const [unreadMessages] = await connection.query(sql, [userId]);

    return NextResponse.json({ unreadMessages }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn chưa đọc:", error); // Log lỗi
    return NextResponse.json({ message: "Lỗi khi lấy tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release(); // Giải phóng kết nối
  }
}

export async function PUT(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Lấy token từ header
  const { senderId, receiverId } = await req.json();
 
  let connection;

  if (!token) {
    return NextResponse.json({ message: "Token không được cung cấp." }, { status: 401 });
  }

  try {
    // Xác thực token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra nếu người dùng có quyền cập nhật tin nhắn
    if (userId !== receiverId) {
      return NextResponse.json({ message: "Không có quyền cập nhật trạng thái tin nhắn." }, { status: 403 });
    }

    connection = await db.getConnection();

    // Cập nhật trạng thái tin nhắn là đã đọc
    await connection.query(`UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`, [senderId, receiverId]);

    return NextResponse.json({ message: "Cập nhật trạng thái tin nhắn đã đọc thành công." }, { status: 200 });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Token không hợp lệ." }, { status: 401 });
    }
    return NextResponse.json({ message: "Lỗi khi cập nhật trạng thái tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
