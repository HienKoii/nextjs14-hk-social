import { Button, Image } from "react-bootstrap";

import { timeAgoComments } from "@/src/utils";
import ImagesAvatar from "../Images/ImagesAvatar";

export default function CommentsReplies({ replies, isRep = false }) {
  return (
    <div>
      {/* Thêm một chút lề trái cho replies */}
      {replies?.map((reply) => (
        <div key={reply.id} className="d-flex mb-2 align-items-start">
          <ImagesAvatar id={reply?.user_id} url={reply?.avatar} isCircle className={"me-1"} />
          <div className="w-100">
            <div
              className="p-2 border rounded" //
              style={{
                backgroundColor: "#e9ecef",
                border: "1px solid #ced4da",
              }}
            >
              <strong>{reply.fullName}</strong>
              <p className="mb-0">{reply.content}</p>
            </div>
            {/* thêm các text time comments, thích, trả lời */}
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted">{timeAgoComments(reply.created_at)}</span>
              <Button variant="link" size="sm">
                Thích
              </Button>
              {isRep && (
                <Button variant="link" size="sm">
                  Trả lời
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
