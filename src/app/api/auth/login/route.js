import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "@/src/config/db";

// Hàm xử lý đăng nhập
export async function POST(req) {
  let connection;
  try {
    // Lấy kết nối từ pool
    connection = await db.getConnection();

    const { identifier, password } = await req.json(); // Thay đổi tên biến từ email sang identifier

    // Kiểm tra xem identifier và password có được cung cấp không
    if (!identifier || !password) {
      return NextResponse.json({ message: "Username hoặc email và mật khẩu là bắt buộc" }, { status: 400 });
    }

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ? OR username = ?", [identifier, identifier]);
    const user = rows[0];

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return NextResponse.json({ message: "Tài khoản hoặc email không tồn tại" }, { status: 404 });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Mật khẩu không chính xác" }, { status: 401 });
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Trả về token và thông tin người dùng
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return NextResponse.json({ message: "Lỗi khi đăng nhập người dùng" }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
