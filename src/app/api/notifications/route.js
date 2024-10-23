import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Lấy thông báo
export async function GET(req) {
  let connection;

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Giả sử token chứa userId
    connection = await db.getConnection();

    // Lấy tất cả thông báo cho người dùng, kèm theo thông tin của actor (người gửi thông báo)
    const [notifications] = await connection.query(
      `
      SELECT n.*, u.fullName AS actor_name, u.avatar AS actor_avatar
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      `,
      [userId]
    );

    // Lọc những thông báo chưa đọc
    const unreadNotifications = notifications.filter((notification) => !notification.is_read);

    return NextResponse.json({ notifications, unreadNotifications }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error); // Ghi lại lỗi cho việc gỡ lỗi
    return NextResponse.json({ message: "Lỗi khi lấy thông báo.", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

//Thêm Thông Báo
export async function POST(req) {
  const { userId, actorId, postId, commentId, type } = await req.json();
  let connection;

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded.userId;
    if (tokenUserId != actorId) {
      return NextResponse.json({ message: "Không có hợp lệ." }, { status: 401 });
    }
    connection = await db.getConnection();
    const sql = `
      INSERT INTO notifications (user_id, actor_id, post_id, comment_id, type)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [userId, actorId, postId, commentId, type]);

    return NextResponse.json({ message: "Thông báo đã được gửi." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi thêm thông báo." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

//Cập nhật tất cả thông báo thành đã đọc
export async function PUT(req) {
  let connection;

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Không có token." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    connection = await db.getConnection();

    // Cập nhật tất cả thông báo chưa đọc thành đã đọc
    const [result] = await connection.query(`UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false`, [userId]);

    return NextResponse.json({ message: "Tất cả thông báo chưa đọc đã được cập nhật thành đã đọc.", affectedRows: result.affectedRows }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông báo:", error);
    return NextResponse.json({ message: "Lỗi khi cập nhật thông báo.", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
