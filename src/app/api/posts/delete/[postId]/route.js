import { db } from "@/src/config/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function DELETE(req, { params }) {
  let connection;
  const { postId } = params;
  try {
    connection = await db.getConnection();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Token không hợp lệ." }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kiểm tra xem bài viết có thuộc về user đang đăng nhập không
    const [post] = await connection.query("SELECT images FROM posts WHERE id = ? AND user_id = ?", [postId, userId]);
    if (post.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Bài viết không tồn tại" }), { status: 404 });
    }
    const imagePaths = JSON.parse(post[0].images);
    console.log("imagePaths", imagePaths);

    // Xóa tất cả các file ảnh liên quan nếu có
    if (Array.isArray(imagePaths) && imagePaths.length > 0) {
      imagePaths.forEach((imagePath) => {
        const imageFullPath = path.join(process.cwd(), "public", "uploads", "posts", imagePath);
        if (fs.existsSync(imageFullPath)) {
          fs.unlinkSync(imageFullPath); // Xóa ảnh từ thư mục
        }
      });
    }

    // Xóa tất cả cảm xúc liên quan đến bài viết
    await connection.query("DELETE FROM reactions WHERE post_id = ?", [postId]);

    // Xóa tất cả bình luận liên quan đến bài viết
    await connection.query("DELETE FROM comments WHERE post_id = ?", [postId]);

    // Cuối cùng xóa bài viết
    await connection.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [postId, userId]);

    return new NextResponse(JSON.stringify({ message: "Xóa bài viết thành công." }), { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    return new NextResponse(JSON.stringify({ message: "Lỗi khi xóa bài viết." }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
