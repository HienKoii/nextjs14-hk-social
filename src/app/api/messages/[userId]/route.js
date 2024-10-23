import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";
// Lấy tin nhắn giữa người dùng hiện tại và một người bạn (receiverId)
export async function GET(req, { params }) {
  const { userId } = params; // userId là ID của người bạn mà bạn đang chat

  let connection;

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực." }, { status: 401 });
    }

    const { userId: senderId } = jwt.verify(token, process.env.JWT_SECRET); // Lấy ID của người dùng hiện tại


    connection = await db.getConnection();

    // Lấy tin nhắn giữa người dùng hiện tại và người nhận
    const [messages] = await connection.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [senderId, userId, userId, senderId]
    );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return NextResponse.json({ message: "Lỗi khi lấy tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
