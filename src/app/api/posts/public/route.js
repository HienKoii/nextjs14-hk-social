import { NextResponse } from "next/server";
import { db } from "@/src/config/db";

// Hàm xử lý lấy các bài viết công khai với phân trang
export async function GET(req) {
  let connection;
  try {
    connection = await db.getConnection();
    // Lấy tham số từ query string
    const { searchParams } = req.nextUrl;
    const offset = Math.max(0, parseInt(searchParams.get("offset")) || 0);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit")) || 5, 1), 100); // Mặc định là 5 bài, tối đa 100 bài

    const sql = `
        SELECT posts.*, users.avatar, users.fullName, users.tick,
        COUNT(DISTINCT reactions.id) AS totalReactions, -- Đếm tổng số reactions cho mỗi bài viết
        COUNT(DISTINCT comments.id) AS totalComments -- Đếm tổng số bình luận cho mỗi bài viết
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        LEFT JOIN reactions ON posts.id = reactions.post_id 
        LEFT JOIN comments ON posts.id = comments.post_id -- Thêm JOIN với bảng comments để tính tổng bình luận
        WHERE posts.status = 0 
        GROUP BY posts.id, users.avatar, users.fullName
        ORDER BY posts.created_at DESC 
        LIMIT ? OFFSET ?
    `;

    // Lấy bài viết công khai với phân trang
    const [publicPosts] = await connection.query(sql, [limit, offset || 0]);
    for (let post of publicPosts) {
      const reactionsSql = `
          SELECT r.*, u.fullName, u.avatar, u.tick
          FROM reactions r
          JOIN users u ON r.user_id = u.id
          WHERE r.post_id = ?
          ORDER BY r.created_at DESC
        `;

      // Truy vấn để lấy danh sách reactions cho từng bài viết
      const [reactionsData] = await connection.query(reactionsSql, [post.id]);
      post.reactions = reactionsData; // Gắn danh sách reactions vào mỗi bài viết
    }

    // Kiểm tra nếu không có bài viết nào
    if (!publicPosts || publicPosts.length === 0) {
      return NextResponse.json({ posts: [], message: "Không có bài viết nào" }, { status: 200 });
    }

    // Trả về danh sách bài viết công khai
    return NextResponse.json({ posts: publicPosts }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết công khai:", error);
    return NextResponse.json({ message: "Lỗi khi lấy bài viết công khai" }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
