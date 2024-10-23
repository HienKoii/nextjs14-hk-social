// app/api/user/[userID]/route.js
import { db } from "@/src/config/db";
import { userInfoSql } from "@/src/lib/Queries/user";
import jwt from "jsonwebtoken";

// Tạo handler GET với dynamic userID
export async function GET(req, { params }) {
  let connection;
  const { userID } = params; // Lấy userID từ URL params
  let tokenUserId = null; // userId từ token

  try {
    connection = await db.getConnection();

    // Lấy thông tin user dựa trên userID từ URL
    const [userRows] = await connection.query(userInfoSql, [userID]);
    const user = userRows[0];

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Lấy token từ header (nếu có)
    const token = req.headers.get("Authorization")?.split(" ")[1];
    let isFriend = false; // Biến kiểm tra xem có phải bạn bè hay không
    let isFriendRequestPending = false;
    
    if (token) {
      // Giải mã token để lấy userId từ token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        tokenUserId = decoded.userId;

        // Kiểm tra xem tokenUserId có phải bạn của userID hay không
        const sqlFriendCheck = `
            SELECT 1 FROM friends WHERE (user_id = ? AND friend_id = ? AND status = 'accepted') OR (user_id = ? AND friend_id = ? AND status = 'accepted')
        `;
        const [friendCheck] = await connection.query(sqlFriendCheck, [tokenUserId, userID, userID, tokenUserId]);

        isFriend = friendCheck.length > 0; // Nếu có kết quả, nghĩa là họ là bạn bè

        const sqlFriendRequestCheck = `
            SELECT 1 FROM friend_requests 
            WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
        `;
        const [friendRequestCheck] = await connection.query(sqlFriendRequestCheck, [tokenUserId, userID]);

        isFriendRequestPending = friendRequestCheck.length > 0; // Kiểm tra xem có yêu cầu kết bạn đang pending hay không
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    }

    // Tạo SQL động dựa trên tình trạng token và quan hệ bạn bè
    let postCondition = "p.status = 0"; // Mặc định chỉ lấy bài viết công khai

    if (tokenUserId == userID) {
      // Nếu userId từ token trùng với userID từ params => Lấy tất cả bài viết
      postCondition = "1"; // 1 là điều kiện luôn đúng
    } else if (isFriend) {
      // Nếu là bạn bè => Lấy bài viết công khai và bài viết cho bạn bè
      postCondition = "(p.status = 0 OR p.status = 1)";
    }

    // Lấy tất cả bài viết của userID này dựa trên điều kiện
    const [postsRows] = await connection.query(
      `
          SELECT p.*, u.fullName, u.avatar,  u.tick, 
                COUNT(DISTINCT r.id) AS totalReactions, -- Đếm tổng số reactions
                COUNT(DISTINCT c.id) AS totalComments  -- Đếm tổng số comments
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.id -- Join để lấy username
          LEFT JOIN reactions r ON p.id = r.post_id -- Join để lấy tổng reactions
          LEFT JOIN comments c ON p.id = c.post_id -- Join để lấy tổng comments
          WHERE p.user_id = ? AND ${postCondition} -- Áp dụng điều kiện bài viết
          GROUP BY p.id, u.username
          ORDER BY p.created_at DESC
      `,
      [userID]
    );

    // Lấy reactions cho từng bài viết
    for (let post of postsRows) {
      const reactionsSql = `
          SELECT r.*, u.fullName, u.avatar
          FROM reactions r
          JOIN users u ON r.user_id = u.id
          WHERE r.post_id = ?
          ORDER BY r.created_at DESC
        `;

      const [reactionsData] = await connection.query(reactionsSql, [post.id]);
      post.reactions = reactionsData; // Gắn danh sách reactions vào mỗi bài viết
    }

    // Lấy danh sách bạn bè của user
    const [friendsRows] = await connection.query(
      `
      SELECT u.id, u.fullName, u.avatar 
      FROM friends f 
      JOIN users u ON u.id = f.friend_id 
      WHERE f.user_id = ?
    `,
      [userID]
    );

    // Trả về dữ liệu người dùng, bài viết và bạn bè
    const dataNew = { ...user, friends: friendsRows, isFriendRequestPending };
    return new Response(JSON.stringify({ user: dataNew, posts: postsRows }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data or posts:", error);
    return new Response(JSON.stringify({ message: "Error fetching user data or posts" }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
