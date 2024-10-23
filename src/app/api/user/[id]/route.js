import { NextResponse } from "next/server";
import { db } from "@/src/config/db"; // Import kết nối cơ sở dữ liệu
import { userInfoSql } from "@/src/lib/Queries/user";

export async function GET(req, { params }) {
  let connection;
  const { id } = params;
  try {
    connection = await db.getConnection();

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const [rows] = await connection.query(userInfoSql, [id]);
    const user = rows[0];

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json({ message: "Lỗi khi lấy thông tin người dùng" }, { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
