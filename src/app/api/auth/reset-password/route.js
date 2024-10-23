import { NextResponse } from "next/server";
import { db } from "@/src/config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Reset password API
export async function POST(req) {
  let connection;
  try {
    const { token, password } = await req.json();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    connection = await db.getConnection();

    // Check if token exists and hasn't expired
    const sqlCheckToken = `SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()`;
    const [resetRecord] = await connection.query(sqlCheckToken, [email, token]);

    if (resetRecord.length === 0) {
      return NextResponse.json({ message: "Token không hợp lệ hoặc đã hết hạn." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await connection.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

    // Delete the reset token after successful password update
    await connection.query(`DELETE FROM password_resets WHERE email = ?`, [email]);

    return NextResponse.json({ message: "Đặt lại mật khẩu thành công." }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return NextResponse.json({ message: "Lỗi khi đặt lại mật khẩu." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
