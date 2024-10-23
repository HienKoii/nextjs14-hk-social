import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Từ chối yêu cầu kết bạn
export async function DELETE(req, { params }) {
  let connection;
  try {
    const { senderId } = params;

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token

    connection = await db.getConnection();

    // Kiểm tra nếu yêu cầu kết bạn tồn tại
    const [request] = await connection.query(
      `SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [senderId, userId] // sender_id là người đã gửi yêu cầu, userId là người nhận
    );

    if (request.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy yêu cầu kết bạn." }, { status: 404 });
    }

    // Xóa yêu cầu kết bạn
    await connection.query(`DELETE FROM friend_requests WHERE sender_id = ? AND receiver_id = ?`, [senderId, userId]);

    return NextResponse.json({ message: "Đã từ chối yêu cầu kết bạn." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi từ chối yêu cầu kết bạn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
