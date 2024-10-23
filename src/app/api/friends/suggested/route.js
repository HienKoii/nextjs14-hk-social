import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Gợi ý kết bạn với số bạn chung (mutual friends)
export async function GET(req) {
  let connection;

  // Lấy token từ header Authorization
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Truy vấn để gợi ý kết bạn và tính số bạn chung
    const sql = `
      SELECT u.id, u.fullName, u.avatar, u.tick,
        (
          SELECT COUNT(*)
          FROM friends f1
          JOIN friends f2 ON f1.friend_id = f2.friend_id
          WHERE f1.user_id = ? AND f2.user_id = u.id AND f1.status = 'accepted' AND f2.status = 'accepted'
        ) AS mutualFriendsCount
      FROM users u
      WHERE u.id != ?
        AND u.id NOT IN (
          SELECT friend_id FROM friends WHERE user_id = ? AND status = 'accepted'
        )
        AND u.id NOT IN (
          SELECT receiver_id FROM friend_requests WHERE sender_id = ? AND status = 'pending'
        )
        AND u.id NOT IN (
          SELECT sender_id FROM friend_requests WHERE receiver_id = ? AND status = 'pending'
        )
      LIMIT 10
    `;

    const [suggestedFriends] = await connection.query(sql, [userId, userId, userId, userId, userId]);

    return NextResponse.json({ suggestedFriends }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi gợi ý kết bạn:", error);
    return NextResponse.json({ message: "Lỗi khi gợi ý kết bạn." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
