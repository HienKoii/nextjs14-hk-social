import { db } from "@/src/config/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  let connection;
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  const { friendId } = params; // friendId từ URL
  const { action } = await req.json(); // Lấy action (accept hoặc reject)

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (action === "accept") {
      // Chấp nhận kết bạn
      const sqlAcceptUpdate = `UPDATE friend_requests  WHERE sender_id = ? AND receiver_id = ? `;
      await connection.query(sqlAcceptUpdate, [friendId, userId]);

      const sqlAcceptInsert = ` INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'accepted'), (?, ?, 'accepted')`;
      await connection.query(sqlAcceptInsert, [userId, friendId, friendId, userId]);

      return NextResponse.json({ message: "Đã chấp nhận kết bạn." }, { status: 200 });
    } else if (action === "reject") {
      // Từ chối kết bạn
      const sqlRejectUpdate = `UPDATE friend_requests SET status = 'rejected' WHERE sender_id = ? AND receiver_id = ?`;
      await connection.query(sqlRejectUpdate, [friendId, userId]);

      return NextResponse.json({ message: "Đã từ chối kết bạn." }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Hành động không hợp lệ." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi xử lý yêu cầu kết bạn." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
