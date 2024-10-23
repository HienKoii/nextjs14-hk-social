import { db } from "@/src/config/db";
import bcrypt from "bcrypt";

export async function POST(request) {
  let connection;
  try {
    connection = await db.getConnection();
    const { username, email, password, fullName } = await request.json();

    // Kiểm tra nếu các trường không đầy đủ
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "Vui lòng điền đầy đủ thông tin!" }), {
        status: 400,
      });
    }

    // Kiểm tra nếu tài khoản đã tồn tại
    const [isUserName] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);
    if (isUserName.length > 0) {
      return new Response(JSON.stringify({ message: "Tài khoản đã tồn tại!" }), {
        status: 409,
      });
    }
    // Kiểm tra nếu email đã tồn tại
    const [isEmail] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (isEmail.length > 0) {
      return new Response(JSON.stringify({ message: "Email đã tồn tại!" }), {
        status: 409,
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng mới vào cơ sở dữ liệu
    await db.execute("INSERT INTO users (username, email, password , fullName) VALUES (?, ?, ? , ?)", [username, email, hashedPassword, fullName]);

    return new Response(JSON.stringify({ message: "Đăng ký thành công!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    return new Response(JSON.stringify({ message: "Đã xảy ra lỗi!" }), {
      status: 500,
    });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
