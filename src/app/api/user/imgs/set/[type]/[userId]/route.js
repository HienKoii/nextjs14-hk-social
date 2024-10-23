import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Đường dẫn đến file cấu hình db của bạn
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  let connection;

  const { type, userId } = params; // Lấy type và userId từ params

  try {
    connection = await db.getConnection();
    const data = await req.json(); // Lấy dữ liệu từ request body
    const { imagePath } = data; // Giả định bạn gửi đường dẫn hình ảnh mới

    const authHeader = req.headers.get("Authorization"); // Lấy token từ header
    if (!authHeader) {
      return NextResponse.json({ message: "Không có token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Tách token từ header
    // Giải mã token để lấy userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdToken = decoded.userId;

    if (userId != userIdToken) {
      return NextResponse.json({ message: "Không hợp lệ" }, { status: 500 });
    }

    // Kiểm tra xem type có hợp lệ không
    if (type !== "avatar" && type !== "background") {
      return NextResponse.json({ error: "Type không hợp lệ." }, { status: 400 });
    }

    // Cập nhật đường dẫn hình ảnh trong cơ sở dữ liệu
    const updateQuery = `UPDATE users SET ${type} = ? WHERE id = ?`;
    await connection.query(updateQuery, [imagePath, userId]);

    return NextResponse.json({ message: "Cập nhật thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật ảnh:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật ảnh." }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
