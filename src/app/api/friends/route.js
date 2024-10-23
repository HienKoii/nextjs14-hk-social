import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";

// Lấy danh sách bạn bè của người dùng
export async function GET(req) {
  let connection;
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Truy vấn để lấy danh sách bạn bè và số bạn chung
    const sql = `
      SELECT u.id, u.fullName, u.avatar, u.tick,
        (
          SELECT COUNT(*)
          FROM friends f1
          JOIN friends f2 ON f1.friend_id = f2.friend_id
          WHERE f1.user_id = ? AND f2.user_id = u.id AND f1.status = 'accepted' AND f2.status = 'accepted'
        ) AS mutualFriendsCount
      FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ? AND f.status = 'accepted'
    `;

    const [friends] = await connection.query(sql, [userId, userId]);

    return NextResponse.json({ friends }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè:", error);
    return NextResponse.json({ message: "Lỗi khi lấy danh sách bạn bè." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}

// Gửi yêu cầu kết bạn
export async function POST(req) {
  let connection;
  const { friendId } = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem đã gửi lời mời kết bạn chưa
    const [existing] = await connection.query(
      `
      SELECT * FROM friend_requests 
      WHERE sender_id = ? AND receiver_id = ?
    `,
      [userId, friendId]
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Đã gửi lời mời kết bạn." }, { status: 400 });
    }

    // Gửi lời mời kết bạn
    await connection.query(
      `
      INSERT INTO friend_requests (sender_id, receiver_id, status)
      VALUES (?, ?, 'pending')
    `,
      [userId, friendId]
    );

    return NextResponse.json({ message: "Gửi lời mời kết bạn thành công." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi gửi lời mời kết bạn." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
