import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Đảm bảo bạn đã cấu hình kết nối với database
import jwt from "jsonwebtoken";

// API thêm bình luận mới
export async function POST(req) {
  let connection;

  const { post_id, content, parent_id } = await req.json(); // Lấy dữ liệu từ body request

  if (!post_id || !content) {
    return new NextResponse(JSON.stringify({ message: "Thiếu thông tin bình luận." }), { status: 400 });
  }

  try {
    connection = await db.getConnection();
    const token = req.headers.get("authorization")?.split(" ")[1];

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Lấy thông tin bài viết để biết ai là người nhận thông báo
    const [post] = await connection.query(`SELECT user_id FROM posts WHERE id = ?`, [post_id]);
    const receiverId = post[0]?.user_id; // user_id của bài viết

    // Thực hiện truy vấn thêm bình luận vào cơ sở dữ liệu
    const [result] = await connection.query(
      `
      INSERT INTO comments (post_id, user_id, content, parent_id) 
      VALUES (?, ?, ?, ?)
    `,
      [post_id, userId, content, parent_id || null] // Thêm parent_id để xử lý bình luận trả lời (nếu có)
    );

    // Tạo thông báo cho người nhận
    if (receiverId) {
      await connection.query(
        `INSERT INTO notifications (user_id, actor_id, post_id, type) 
         VALUES (?, ?, ?, 'comment')`,
        [receiverId, userId, post_id] // receiverId là người nhận thông báo, userId là người bình luận
      );
    }

    // Trả về phản hồi thành công cùng với commentId và receiverId
    return new NextResponse(JSON.stringify({ message: "Thêm bình luận thành công", commentId: result.insertId, receiverId }), { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    return new NextResponse(JSON.stringify({ message: "Lỗi khi thêm bình luận" }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
