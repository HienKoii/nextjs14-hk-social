import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";

export async function GET(req) {
  let connection;
  try {
    // Xác thực token người dùng
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực" }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    connection = await db.getConnection();

    // Truy vấn lấy danh sách người đã nhắn tin với bạn kèm fullName và avatar
    const [users] = await connection.query(
      `
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id 
        END AS chat_user_id,
        users.fullName,
        users.avatar
      FROM messages
      JOIN users ON users.id = 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id 
        END
      WHERE sender_id = ? OR receiver_id = ?
      `,
      [userId, userId, userId, userId]
    );

    // Lấy tin nhắn mới nhất cho từng chat_user_id
    const chatUsersWithLatestMessage = await Promise.all(
      users.map(async (user) => {
        const [latestMessageRows] = await connection.query(
          `
          SELECT content, is_read , sender_id, is_deleted, created_at
          FROM messages
          WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [userId, user.chat_user_id, user.chat_user_id, userId]
        );

        const latestMessage = latestMessageRows[0] || null;

        return {
          chat_user_id: user.chat_user_id,
          fullName: user.fullName,
          avatar: user.avatar,
          sender_id: latestMessage ? latestMessage.sender_id : null,
          is_deleted: latestMessage ? latestMessage.is_deleted : null,
          is_read: latestMessage ? latestMessage.is_read : null,
          latest_message: latestMessage ? latestMessage.content : null,
          latest_message_time: latestMessage ? latestMessage.created_at : null,
        };
      })
    );

    // Trả về danh sách người đã nhắn tin với bạn và tin nhắn mới nhất
    return NextResponse.json({ chatUsers: chatUsersWithLatestMessage }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người nhắn tin:", error);
    return NextResponse.json({ message: "Lỗi khi lấy danh sách người nhắn tin." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
