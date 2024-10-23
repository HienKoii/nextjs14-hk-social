import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  const { type, userId, imageName } = params; // Lấy userId và imageName từ params
  // Xác định đường dẫn đầy đủ đến ảnh cần xóa
  const imagePath = path.join(process.cwd(), "public", "uploads", type, userId, imageName);

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdToken = decoded.userId;

    if (userIdToken != userId) {
      return NextResponse.json({ message: "Không hợp lệ." }, { status: 404 });
    }
    // Kiểm tra xem file ảnh có tồn tại không
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ message: "File không tồn tại." }, { status: 404 });
    }

    // Xóa file ảnh
    fs.unlinkSync(imagePath);

    return NextResponse.json({ message: "Xóa ảnh thành công." }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    return NextResponse.json({ error: "Lỗi khi xóa ảnh." }, { status: 500 });
  }
}
