import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Hàm gửi email
const sendEmail = async (to, subject, htmlContent) => {
  console.log("to", to);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Hoặc thay bằng thông tin SMTP server của bạn
      port: 587,
      secure: false, // True nếu sử dụng cổng 465
      auth: {
        user: process.env.SMTP_USER, // Username cho SMTP
        pass: process.env.SMTP_PASSWORD, // Password hoặc API key cho SMTP
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL, // Địa chỉ email người gửi
      to, // Địa chỉ người nhận
      subject, // Tiêu đề email
      html: htmlContent, // Nội dung email dưới dạng HTML
    };

    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error("Không thể gửi email, vui lòng thử lại sau.");
  }
};

// API POST để gửi yêu cầu đặt lại mật khẩu
export async function POST(req) {
  const { email } = await req.json();
  let connection;

  try {
    connection = await db.getConnection();

    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const [user] = await connection.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (user.length === 0) {
      return NextResponse.json({ message: "Email không tồn tại." }, { status: 404 });
    }

    // Tạo token JWT để đặt lại mật khẩu
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Lưu token vào bảng password_resets
    const expiresAt = new Date(Date.now() + 3600000); // 1 giờ
    await connection.query(`INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`, [email, token, expiresAt, token, expiresAt]);

    // Tạo liên kết đặt lại mật khẩu
    const resetLink = `${process.env.DOMAIN}/reset-password?token=${token}`;

    // Gửi email với liên kết đặt lại mật khẩu
    await sendEmail(
      email,
      "Đặt lại mật khẩu",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h2 style="color: #007bff; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào nút dưới đây để đặt lại mật khẩu của bạn:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
          </div>
          <p style="margin-top: 20px; color: #dc3545;">Liên kết này sẽ hết hạn sau 1 giờ.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ hỗ trợ</p>
        </div>
        `
    );

    return NextResponse.json({ message: "Đã gửi liên kết đặt lại mật khẩu." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi khi gửi liên kết đặt lại mật khẩu." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
