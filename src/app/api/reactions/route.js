import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Ensure you have the database configuration
import jwt from "jsonwebtoken";

// API to handle reactions
export async function POST(req) {
  let connection;

  try {
    connection = await db.getConnection();
    const { post_id, type } = await req.json(); // Get data from request body

    if (!post_id || !type) {
      return new NextResponse(JSON.stringify({ message: "Thiếu thông tin bài viết hoặc loại cảm xúc." }), { status: 400 });
    }

    // Check for login token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Token không hợp lệ." }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token to get user info
    const userId = decoded.userId;

    // Get the receiverId from the post
    const [post] = await connection.query(`SELECT user_id FROM posts WHERE id = ?`, [post_id]);
    const receiverId = post[0]?.user_id; // user_id của bài viết

    // Check if the user has already reacted to the post
    const [existingReaction] = await connection.query("SELECT * FROM reactions WHERE post_id = ? AND user_id = ?", [post_id, userId]);

    if (existingReaction.length > 0) {
      const currentType = existingReaction[0].type;

      if (currentType === type) {
        // If the same reaction type is clicked, remove the reaction
        await connection.query("DELETE FROM reactions WHERE post_id = ? AND user_id = ?", [post_id, userId]);
        return new NextResponse(JSON.stringify({ status: "DELETE", message: "Đã xóa cảm xúc.", data: { post_id, userId, type: "" }, receiverId }), { status: 200 });
      } else {
        // If a different reaction type is clicked, update the reaction
        await connection.query("UPDATE reactions SET type = ? WHERE post_id = ? AND user_id = ?", [type, post_id, userId]);
        return new NextResponse(
          JSON.stringify({
            status: "UPDATE",
            message: "Cập nhật cảm xúc thành công.",
            data: { type, post_id, userId },
            receiverId,
          }),
          { status: 200 }
        );
      }
    } else {
      // If no reaction exists, add a new reaction
      await connection.query("INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)", [post_id, userId, type]);

      // Create notification for the receiver
      if (receiverId) {
        await connection.query(
          `INSERT INTO notifications (user_id, actor_id, post_id, type) 
           VALUES (?, ?, ?, ?)`,
          [receiverId, userId, post_id, type] // receiverId là người nhận thông báo, userId là người thả cảm xúc
        );
      }

      // After INSERT is successful, retrieve the newly created reaction
      const [newReaction] = await connection.query(
        `
          SELECT r.*, u.fullName, u.avatar FROM reactions r JOIN users u ON r.user_id = u.id WHERE post_id = ? AND user_id = ?`,
        [post_id, userId]
      );

      return new NextResponse(JSON.stringify({ status: "INSERT", message: "Thả cảm xúc thành công.", data: newReaction[0], receiverId }), { status: 201 });
    }
  } catch (error) {
    console.error("Lỗi khi thả cảm xúc:", error);
    return new NextResponse(JSON.stringify({ message: "Lỗi khi thả cảm xúc." }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
