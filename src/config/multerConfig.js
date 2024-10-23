const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đường dẫn đến thư mục uploads
const uploadsDir = path.join(__dirname, "../../uploads");

// Kiểm tra và tạo thư mục uploads nếu nó không tồn tại
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Thư mục lưu trữ hình ảnh
  },
  filename: (req, file, cb) => {
    const username = req.body.username; // Lấy tên người dùng từ body
    const originalName = file.originalname; // Lấy tên file gốc
    const extension = path.extname(originalName); // Lấy phần mở rộng của file
    const baseName = path.basename(originalName, extension); // Lấy tên file không có phần mở rộng

    // Tạo tên file ban đầu
    let newFileName = `${username}-${originalName}`;
    let filePath = path.join(uploadsDir, newFileName);
    let count = 1;

    // Kiểm tra nếu file đã tồn tại và tăng số đếm nếu cần
    while (fs.existsSync(filePath)) {
      newFileName = `${username}-${baseName}-${count}${extension}`;
      filePath = path.join(uploadsDir, newFileName);
      count++;
    }

    cb(null, newFileName); // Ghi tên file mới
  },
});

// Khởi tạo Multer
const upload = multer({ storage: storage });

module.exports = upload;
