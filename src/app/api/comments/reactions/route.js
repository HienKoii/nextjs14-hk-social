import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Đảm bảo bạn đã cấu hình kết nối với database
import jwt from "jsonwebtoken";

// API để xử lý thả cảm xúc bình luận
export async function POST(req) {
  let connection;
  try {
    connection = await db.getConnection();
    const { comment_id, type } = await req.json(); // Lấy dữ liệu từ body của yêu cầu

    if (!comment_id || !type) {
      return new NextResponse(JSON.stringify({ message: "Thiếu thông tin bình luận hoặc loại cảm xúc." }), { status: 400 });
    }

    // Kiểm tra token đăng nhập
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Token không hợp lệ." }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token để lấy thông tin người dùng
    const userId = decoded.userId;

    // Kiểm tra xem người dùng đã thả cảm xúc cho bình luận chưa
    const [existingReaction] = await connection.query("SELECT * FROM comment_reactions WHERE comment_id = ? AND user_id = ?", [comment_id, userId]);

    if (existingReaction.length > 0) {
      const currentType = existingReaction[0].type;

      if (currentType === type) {
        // Nếu cùng một loại cảm xúc được click, xóa cảm xúc
        await connection.query("DELETE FROM comment_reactions WHERE comment_id = ? AND user_id = ?", [comment_id, userId]);
        return new NextResponse(JSON.stringify({ status: "DELETE", message: "Đã xóa cảm xúc." }), { status: 200 });
      } else {
        // Nếu loại cảm xúc khác được click, cập nhật cảm xúc
        await connection.query("UPDATE comment_reactions SET type = ? WHERE comment_id = ? AND user_id = ?", [type, comment_id, userId]);
        return new NextResponse(
          JSON.stringify({
            status: "UPDATE",
            message: "Cập nhật cảm xúc thành công.",
            data: { type, comment_id, userId },
          }),
          { status: 200 }
        );
      }
    } else {
      // Nếu không có cảm xúc nào tồn tại, thêm cảm xúc mới
      await connection.query("INSERT INTO comment_reactions (comment_id, user_id, type) VALUES (?, ?, ?)", [comment_id, userId, type]);
      // Sau khi INSERT thành công, lấy lại phản ứng vừa tạo
      const [newReaction] = await connection.query(`SELECT cr.*, u.fullName, u.avatar FROM comment_reactions cr JOIN users u ON cr.user_id = u.id WHERE comment_id = ?`, [comment_id]);
      return new NextResponse(JSON.stringify({ status: "INSERT", message: "Thả cảm xúc thành công.", data: newReaction[0] }), { status: 201 });
    }
  } catch (error) {
    console.error("Lỗi khi thả cảm xúc bình luận:", error);
    return new NextResponse(JSON.stringify({ message: "Lỗi khi thả cảm xúc bình luận." }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
