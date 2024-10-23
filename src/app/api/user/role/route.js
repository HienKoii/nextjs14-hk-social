// app/api/user/role/route.js
import { db } from "@/src/config/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  let connection;
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    connection = await db.getConnection();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await connection.query("SELECT role FROM users WHERE id = ?", [decoded.userId]);
    const user = rows[0];

    if (user) {
      return new Response(JSON.stringify({ role: user.role }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching role data" }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
