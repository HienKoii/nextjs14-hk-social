// pages/api/auth/user.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db"; // Import kết nối cơ sở dữ liệu
import { userInfoSql } from "@/src/lib/Queries/user";

export async function GET(req) {
  let connection;
  try {
    connection = await db.getConnection();
    const authHeader = req.headers.get("Authorization"); // Lấy token từ header
    if (!authHeader) {
      return NextResponse.json({ message: "Không có token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Tách token từ header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const [rows] = await connection.query(userInfoSql, [decoded.userId]);
    const user = rows[0];

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
    }
    const [friendsRows] = await connection.query(
      `
      SELECT u.id, u.fullName, u.avatar 
      FROM friends f 
      JOIN users u ON u.id = f.friend_id 
      WHERE f.user_id = ?
    `,
      [user.id]
    );

    const newData = { ...user, friends: friendsRows };
    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json({ message: "Lỗi khi lấy thông tin người dùng" }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
