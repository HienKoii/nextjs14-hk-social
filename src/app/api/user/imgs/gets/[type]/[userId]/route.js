import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { type, userId } = params; // Lấy userId từ params

  const avatarDir = path.join(process.cwd(), "public", "uploads", type, userId);

  try {
    // Kiểm tra xem thư mục có tồn tại không
    if (!fs.existsSync(avatarDir)) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Lấy danh sách các file trong thư mục
    const files = fs.readdirSync(avatarDir);

    // Trả về danh sách đường dẫn file
    const fileUrls = files.map((file) => `${file}`);

    return NextResponse.json(
      {
        data: { url: fileUrls, type, userId },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi lấy ảnh:", error);
    return NextResponse.json({ error: "Lỗi khi lấy ảnh." }, { status: 500 });
  } 
}
