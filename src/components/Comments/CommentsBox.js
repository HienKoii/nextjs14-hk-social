import React, { useState } from "react";
import CommentsReplies from "./CommentsReplies";
import { Image } from "react-bootstrap";
import Link from "next/link";

import { isToken, timeAgoComments } from "@/src/utils";
import ReactionsBtn from "./Reactions/ReactionsBtn";
import ReactionsShow from "../reactions/ReactionsShow";
import CommentsRepliesForm from "./CommentsRepliesForm";
import ImagesAvatar from "../Images/ImagesAvatar";
import { useComments } from "@/src/context/CommentsContext";

export default function CommentsBox() {
  const { comments } = useComments();
  const [showReplies, setShowReplies] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const handleSetShowReplies = () => {
    setShowReplies(true);
  };
  const handleShowRepliesForm = (id) => {
    setReplyingCommentId((prevId) => (prevId === id ? null : id));
  };

  return (
    <>
      {comments?.map((comment) => (
        <div key={comment.id} className="mb-3">
          <div className="w-100 d-flex">
            <Link href={`/profile/${comment?.user_id}`} className="me-3">
              <ImagesAvatar id={comment.user_id} url={comment.avatar} isCircle />
            </Link>
            <div className="d-flex flex-column flex-grow-1">
              <div
                className="p-2 border rounded"
                style={{
                  backgroundColor: "#e9ecef",
                  border: "1px solid #ced4da",
                }}
              >
                <Link
                  href={`/profile/${comment?.user_id}`} //
                  className={`${comment.tick && "d-flex  align-items-center"}`}
                >
                  <strong>{comment.fullName}</strong>
                  {comment.tick ? (
                    <Image
                      src={`/images/tick.png`} //
                      alt="Avatar"
                      width={15}
                      className="rounded-circle ms-1"
                    />
                  ) : null}
                </Link>
                <p className="mb-0">{comment.content}</p>
              </div>

              {/* thêm các text time comments, thích, trả lời */}
              <div>
                <div className="d-flex flex-column justify-content-between align-items-center">
                  <>
                    <div className="w-100 d-flex justify-content-between align-items-center my-2" style={{ position: "relative" }}>
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <span className="text-muted">{timeAgoComments(comment.created_at)}</span>
                        <ReactionsBtn commentId={comment.id} reactions={comment.reactions} />
                        <button
                          className="btn btn-hk-reaction" //
                          onClick={() => handleShowRepliesForm(comment.id)}
                          disabled={!isToken() ? true : false}
                        >
                          Trả lời
                        </button>
                      </div>
                      {comment.reactions.length > 0 && (
                        <div className="d-flex justify-content-center align-items-center">
                          <span className="me-1">{comment.reactions.length}</span>
                          <ReactionsShow reactions={comment.reactions} totalReactions={comment.reactions.length} />
                        </div>
                      )}
                    </div>
                    {replyingCommentId === comment.id && (
                      <CommentsRepliesForm
                        selectorComment={comment} //
                        handleShowRepliesForm={handleShowRepliesForm}
                      />
                    )}
                  </>
                </div>
                {/* Border từ avatar */}
                {!showReplies ? (
                  <>
                    {comment?.replies && comment?.replies.length >= 1 && (
                      <div className="position-relative mb-2">
                        <div
                          className="position-absolute"
                          style={{
                            left: "-43px", // Điều chỉnh vị trí theo avatar
                            top: "-48px", // Vị trí từ dưới cùng của avatar
                            width: "2px",
                            height: "61px", // Chiều cao border
                            backgroundColor: "#ced4da", // Màu của border
                          }}
                        ></div>
                        <div className="d-flex mb-2 align-items-start">
                          <span className="text-muted hk-replies" style={{ cursor: "pointer" }} onClick={() => handleSetShowReplies()}>
                            Xem {comment?.replies.length} phản hồi
                          </span>
                        </div>
                        <div
                          className="position-absolute"
                          style={{
                            left: "-43px", // Điều chỉnh vị trí từ bên trái
                            top: "12px", // Điều chỉnh vị trí từ trên xuống
                            width: "37px", // Chiều rộng của border
                            height: "2px", // Chiều cao border
                            backgroundColor: "#ced4da", // Màu của border
                          }}
                        ></div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <CommentsReplies replies={comment.replies} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
