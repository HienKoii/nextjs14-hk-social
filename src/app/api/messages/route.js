// app/api/messages/route.js
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { db } from "@/src/config/db";

export async function POST(req) {
  let connection;
  const formData = await req.formData();
  const file = formData.get("img");
  console.log("file", file);
  const receiverId = formData.get("receiverId");
  const content = formData.get("content");

  if (!receiverId || !content) {
    return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 401 });
  }

  let imagePaths = "";

  if (file) {
    // Tạo đường dẫn cho thư mục của người dùng
    const userUploadsDir = path.join(process.cwd(), `public/uploads/chat`);

    // Kiểm tra xem thư mục đã tồn tại chưa
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true }); // Tạo thư mục nếu chưa có
    }
    // Lưu trữ và lấy đường dẫn file
    const fullFileName = `${nanoid(5)}-${file.name}`;
    const uploadPath = path.join(userUploadsDir, fullFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(uploadPath, buffer);
    imagePaths = fullFileName;
  }
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET); // Lấy ID của người dùng hiện tại
    const senderId = Number(userId);

    connection = await db.getConnection();

    // Thêm tin nhắn vào bảng messages
    const sql = `INSERT INTO messages (sender_id, receiver_id, content , img) VALUES (?, ?, ?, ?)`;
    await connection.query(sql, [senderId, receiverId, content, imagePaths]);

    return NextResponse.json({ message: "Tin nhắn đã được gửi.", img: imagePaths }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi gửi tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");
  let connection;

  try {
    connection = await db.getConnection();

    // Lấy tất cả tin nhắn giữa hai người dùng
    const [messages] = await connection.query(`SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC`, [
      senderId,
      receiverId,
      receiverId,
      senderId,
    ]);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi lấy tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
