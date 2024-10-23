import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Cập nhật bài viết
export async function PUT(req, { params }) {
  const { postId } = params;
  const { content, status } = await req.json();
  let connection;

  try {
    // Xác thực người dùng qua token
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    connection = await db.getConnection();

    // Kiểm tra xem bài viết có thuộc về người dùng hiện tại hay không
    const [post] = await connection.query(`SELECT * FROM posts WHERE id = ? AND user_id = ?`, [postId, userId]);
    if (!post.length) {
      return NextResponse.json({ message: "Không tìm thấy bài viết hoặc không có quyền chỉnh sửa." }, { status: 404 });
    }

    // Cập nhật bài viết
    await connection.query(`UPDATE posts SET content = ?, status = ?, updated_at = NOW() WHERE id = ?`, [content, status, postId]);

    return NextResponse.json({ message: "Cập nhật bài viết thành công." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi cập nhật bài viết." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
