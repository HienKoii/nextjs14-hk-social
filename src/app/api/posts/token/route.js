import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";

// Hàm xử lý lấy bài viết
export async function GET(req) {
  let connection;
  try {
    connection = await db.getConnection();

    // Lấy token từ header
    const token = req.headers.get("Authorization")?.split(" ")[1];

    // Kiểm tra token tồn tại và giải mã
    if (!token) {
      return NextResponse.json({ message: "Không tìm thấy token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Lấy tham số limit và offset từ query
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 5; // Mặc định 5 bài viết
    const offset = parseInt(searchParams.get("offset")) || 0; // Mặc định offset là 0

    // Lấy bài viết theo giới hạn và offset
    const sql = `
        SELECT p.*, u.avatar, u.fullName, u.tick, 
              COUNT(DISTINCT r.id) AS totalReactions, -- Đếm tổng số cảm xúc cho mỗi bài viết
              COUNT(DISTINCT c.id) AS totalComments, -- Đếm tổng số bình luận cho mỗi bài viết
              
              -- Lấy cảm xúc của người dùng hiện tại (nếu có)
              (SELECT type FROM reactions WHERE post_id = p.id AND user_id = ?) AS userReaction
              
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.id 
        LEFT JOIN reactions r ON p.id = r.post_id -- JOIN bảng reactions
        LEFT JOIN comments c ON p.id = c.post_id -- JOIN bảng comments để tính tổng bình luận
        WHERE 
          (p.status = 0) -- Bài viết công khai
          OR 
          (p.status = 1 AND (p.user_id IN (SELECT friend_id FROM friends WHERE user_id = ?) 
          OR p.user_id = ?)) -- Bài viết của bạn bè hoặc chính người dùng
        GROUP BY p.id, u.avatar, u.fullName
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [postsData] = await connection.query(sql, [userId, userId, userId, limit, offset]);

    // Lấy reactions cho từng bài viết
    for (let post of postsData) {
      const reactionsSql = `
          SELECT r.*, u.fullName, u.avatar, u.tick
          FROM reactions r
          JOIN users u ON r.user_id = u.id
          WHERE r.post_id = ?
          ORDER BY r.created_at DESC
      `;
      const [reactionsData] = await connection.query(reactionsSql, [post.id]);
      post.reactions = reactionsData; // Gắn danh sách reactions vào bài viết
    }

    // Trả về danh sách bài viết
    return NextResponse.json({ posts: postsData }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    return NextResponse.json({ message: "Lỗi khi lấy bài viết" }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
