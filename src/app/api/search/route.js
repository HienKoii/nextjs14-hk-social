import { NextResponse } from "next/server";
import { db } from "@/src/config/db";

export async function GET(req) {
  let connection;

  try {
    // Lấy tham số tìm kiếm từ query string
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    if (!search) {
      return NextResponse.json({ message: "Vui lòng nhập từ khóa tìm kiếm." }, { status: 400 });
    }

    connection = await db.getConnection();

    // Tìm kiếm theo tên người dùng (fullName) hoặc nội dung bài viết (content) ở chế độ công khai (status = 0)
    const [results] = await connection.query(`
      SELECT users.id AS userId, users.fullName,users.avatar,users.tick, posts.id AS postId, posts.content, posts.status
      FROM users
      LEFT JOIN posts ON posts.user_id = users.id
      WHERE users.fullName LIKE ? 
      OR (posts.content LIKE ? AND posts.status = 0)
      ORDER BY users.fullName ASC, posts.created_at DESC
    `, [`%${search}%`, `%${search}%`]);

    // Kiểm tra nếu không có kết quả tìm kiếm
    if (results.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy kết quả phù hợp." }, { status: 404 });
    }

    // Trả về kết quả tìm kiếm
    return NextResponse.json({ results }, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return NextResponse.json({ message: "Lỗi khi thực hiện tìm kiếm." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
