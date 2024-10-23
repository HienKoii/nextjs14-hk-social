import { db } from "@/src/config/db"; // Đảm bảo bạn đã cấu hình kết nối với database

export async function GET(req, { params }) {
  let connection;

  const { postId } = params; // Lấy postId từ tham số URL

  try {
    connection = await db.getConnection();

    // Truy vấn để lấy bình luận cho bài viết cụ thể
    const sql = ` 
      SELECT comments.*, users.fullName, users.avatar, users.tick
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE comments.post_id = ? AND comments.parent_id IS NULL
      ORDER BY created_at DESC
    `;

    const [comments] = await connection.query(sql, [postId]);

    // Lấy các bình luận trả lời cho mỗi bình luận gốc
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        // Lấy phản hồi cho bình luận
        const [replies] = await connection.query(
          `
          SELECT replies.*, users.fullName, users.avatar, users.tick
          FROM comments AS replies
          JOIN users ON replies.user_id = users.id
          WHERE replies.parent_id = ?
          ORDER BY replies.created_at DESC
        `,
          [comment.id]
        );

        // Lấy reactions cho bình luận gốc
        const [commentReactions] = await connection.query(
          `
          SELECT cr.type, cr.user_id, u.fullName
          FROM comment_reactions cr
          JOIN users u ON cr.user_id = u.id
          WHERE cr.comment_id = ?
        `,
          [comment.id]
        );

        // Lấy reactions cho các phản hồi
        const repliesWithReactions = await Promise.all(
          replies.map(async (reply) => {
            const [replyReactions] = await connection.query(
              `
              SELECT cr.type, cr.user_id, u.fullName
              FROM comment_reactions cr
              JOIN users u ON cr.user_id = u.id
              WHERE cr.comment_id = ?
            `,
              [reply.id]
            );
            return {
              ...reply,
              reactions: replyReactions.map((reaction) => ({
                type: reaction.type,
                user_id: reaction.user_id,
                fullName: reaction.fullName,
              })),
            };
          })
        );

        return {
          ...comment,
          replies: repliesWithReactions, // Gán phản hồi đã được thêm reactions
          reactions: commentReactions.map((reaction) => ({
            type: reaction.type,
            user_id: reaction.user_id,
            fullName: reaction.fullName,
          })), // Thêm reactions vào bình luận
        };
      })
    );

    // Trả về danh sách bình luận
    return new Response(JSON.stringify({ comments: commentsWithReplies }), { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error); // Ghi lại lỗi
    return new Response(JSON.stringify({ message: "Lỗi khi lấy bình luận" }), { status: 500 });
  } finally {
    // Giải phóng kết nối sau khi sử dụng
    if (connection) connection.release();
  }
}
