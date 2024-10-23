import multer from "multer";
import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Cập nhật đường dẫn đến config db của bạn
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
// Cấu hình multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const username = req.body.username || "default";
      cb(null, `${username}-${file.originalname}`);
    },
  }),
});

// Xử lý POST
export async function POST(req, { params }) {
  let connection;
  
  const { type } = params;
  const formData = await req.formData();
  const files = formData.getAll(type);

  const userId = formData.get("userId");

  let imagePaths = ``;

  // Tạo đường dẫn cho thư mục của người dùng
  const userUploadsDir = path.join(process.cwd(), `public/uploads/${type}/${userId}`);

  for (const file of files) {
    // Kiểm tra xem thư mục đã tồn tại chưa
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true }); // Tạo thư mục nếu chưa có
    }
    // Lưu trữ và lấy đường dẫn file
    const uploadPath = path.join(userUploadsDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(uploadPath, buffer);
    imagePaths = file.name;
  }

  try {
    connection = await db.getConnection();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Token không hợp lệ." }), { status: 401 });
    }

    await connection.query(`UPDATE users SET ${type} = ? WHERE id = ?`, [imagePaths, userId]);
    return NextResponse.json({ message: "Đăng bài thành công" }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi đăng bài:", error);
    return NextResponse.json({ message: "Đăng bài không thành công", error: error.message }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
