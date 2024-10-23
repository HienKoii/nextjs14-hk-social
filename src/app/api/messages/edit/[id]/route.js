import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";

export async function PATCH(req, { params }) {
  let connection;
  const { id } = params; // Lấy ID từ URL
  const { content } = await req.json(); // Lấy nội dung mới từ request body

  if (!content) {
    return NextResponse.json({ message: "Thiếu nội dung tin nhắn." }, { status: 400 });
  }

  try {
    // Xác thực token
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET); // Xác thực người dùng

    connection = await db.getConnection();

    // Cập nhật tin nhắn trong cơ sở dữ liệu
    const sql = `UPDATE messages SET content = ? WHERE id = ? AND (sender_id = ? OR receiver_id = ?)`;
    const [result] = await connection.query(sql, [content, id, userId, userId]);

    // Kiểm tra nếu có bản ghi nào được cập nhật
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Tin nhắn không tồn tại hoặc không được phép sửa." }, { status: 404 });
    }

    return NextResponse.json({ message: "Tin nhắn đã được sửa thành công." }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi sửa tin nhắn:", error);
    return NextResponse.json({ message: "Lỗi khi sửa tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
