import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/src/config/db";
import fs from "fs";
import path from "path";

export async function DELETE(req, { params }) {
  let connection;
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token xác thực." }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const messageId = params.messageId;

    connection = await db.getConnection();

    // Kiểm tra xem tin nhắn có tồn tại và người dùng hiện tại có quyền xóa không
    const [message] = await connection.query(`SELECT * FROM messages WHERE id = ?`, [messageId]);

    if (message.length === 0) {
      return NextResponse.json({ message: "Tin nhắn không tồn tại." }, { status: 404 });
    }

    const msg = message[0];
    console.log("msg", msg);

    if (msg.sender_id !== userId) {
      return NextResponse.json({ message: "Bạn không có quyền xóa tin nhắn này." }, { status: 403 });
    }
    if (msg.img) {
      const imagePath = path.join(process.cwd(), "public", "uploads", "chat", msg.img);
      console.log("imagePath", imagePath);
      // Kiểm tra xem file ảnh có tồn tại không
      if (!fs.existsSync(imagePath)) {
        return NextResponse.json({ message: "File không tồn tại." }, { status: 404 });
      }
      // Xóa file ảnh
      fs.unlinkSync(imagePath);
      // Cập nhật trường img thành ""
      await connection.query(`UPDATE messages SET img = "" WHERE id = ?`, [messageId]);
    }
    // Cập nhật trường is_deleted thành true
    await connection.query(`UPDATE messages SET is_deleted = TRUE WHERE id = ?`, [messageId]);

    return NextResponse.json({ message: "Tin nhắn đã được xóa." }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa tin nhắn:", error);
    return NextResponse.json({ message: "Lỗi khi xóa tin nhắn." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
