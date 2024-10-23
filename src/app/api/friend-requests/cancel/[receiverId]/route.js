import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  let connection;
  try {
    const { receiverId } = params;
    console.log("receiverId", receiverId);

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    connection = await db.getConnection();

    // Kiểm tra nếu yêu cầu kết bạn tồn tại
    const sql = `
      SELECT * FROM friend_requests 
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `;
    const [request] = await connection.query(sql, [userId, receiverId]);

    if (request.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy lời mời kết bạn." }, { status: 404 });
    }

    // Xóa yêu cầu kết bạn
    await connection.query(`DELETE FROM friend_requests WHERE sender_id = ? AND receiver_id = ?`, [userId, receiverId]);

    return NextResponse.json({ message: "Đã hủy lời mời kết bạn." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi hủy lời mời kết bạn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
