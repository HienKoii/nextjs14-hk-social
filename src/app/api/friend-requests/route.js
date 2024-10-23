import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

// Lấy danh sách yêu cầu kết bạn
export async function GET(req) {
  let connection;
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `
      SELECT fr.id, u.id AS sender_id, u.fullName, u.tick, u.avatar, fr.status,
      (
        SELECT COUNT(*)
        FROM friends f1
        JOIN friends f2 ON f1.friend_id = f2.friend_id
        WHERE f1.user_id = ? AND f2.user_id = fr.sender_id AND f1.status = 'accepted' AND f2.status = 'accepted'
      ) AS mutualFriendsCount
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `;

    const [requests] = await connection.query(sql, [userId, userId]);

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi lấy yêu cầu kết bạn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// Gửi yêu cầu kết bạn
export async function POST(req) {
  let connection;
  const { receiverId } = await req.json();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra nếu một trong hai đã gửi yêu cầu kết bạn
    const [existing] = await connection.query(
      `SELECT * FROM friend_requests 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)`,
      [userId, receiverId, receiverId, userId]
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Đã có lời mời kết bạn giữa hai người dùng." }, { status: 201 });
    }

    // Chèn yêu cầu kết bạn mới
    await connection.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status) 
       VALUES (?, ?, 'pending')`,
      [userId, receiverId]
    );

    // Tạo thông báo cho người nhận
    await connection.query(
      `INSERT INTO notifications (user_id, actor_id, type) 
       VALUES (?, ?, 'friend_request')`,
      [receiverId, userId] // userId là người gửi yêu cầu
    );

    return NextResponse.json({ message: "Gửi lời mời kết bạn thành công.", receiverId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi gửi lời mời kết bạn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// Chấp nhận yêu cầu kết bạn
export async function PUT(req) {
  let connection;

  const { requestId } = await req.json(); // Lấy ID yêu cầu kết bạn từ body
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Không có token." }, { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra yêu cầu kết bạn
    const [request] = await connection.query(`SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ? AND status = 'pending'`, [requestId, userId]);

    if (request.length === 0) {
      return NextResponse.json({ message: "Yêu cầu kết bạn không hợp lệ." }, { status: 404 });
    }

    // Cập nhật trạng thái yêu cầu kết bạn
    await connection.query(`UPDATE friend_requests SET status = 'accepted' WHERE id = ?`, [requestId]);

    // Thêm quan hệ bạn bè
    await connection.query(
      `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'accepted')`,
      [userId, request[0].sender_id] // Chấp nhận từ người gửi yêu cầu
    );

    await connection.query(
      `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'accepted')`,
      [request[0].sender_id, userId] // Đảm bảo người gửi cũng có quan hệ bạn bè ngược lại
    );

    // Tạo thông báo cho người gửi yêu cầu
    await connection.query(
      `INSERT INTO notifications (user_id, actor_id, type) 
       VALUES (?, ?, 'friend_request_accepted')`,
      [request[0].sender_id, userId] // userId là người chấp nhận yêu cầu
    );

    return NextResponse.json({ message: "Đã chấp nhận yêu cầu kết bạn.", receiverId: request[0].sender_id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi chấp nhận yêu cầu kết bạn." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
