import React, { useState } from "react";
import { Button, FloatingLabel, Form, Image } from "react-bootstrap";

import { useComments } from "@/src/context/CommentsContext";
import { useUser } from "@/src/context/UserContext";
import ImagesAvatar from "../Images/ImagesAvatar";

export default function CommentsRepliesForm({ selectorComment, handleShowRepliesForm }) {
  const { handleAddComment } = useComments();
  const { user } = useUser();
  console.log("user", user);

  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e, post) => {
    e.preventDefault();
    const data = {
      post_id: post.post_id,
      content: newComment,
      parent_id: post.id,
    };

    setNewComment("");
    handleShowRepliesForm(post.id);
    await handleAddComment(data);
  };

  return (
    <div className="w-100 d-flex my-2">
      <ImagesAvatar id={user?.id} url={user?.avatar} isCircle className={"me-1"} />
      <div
        className="w-100 d-flex p-2 border rounded"
        style={{
          backgroundColor: "#e9ecef",
          border: "1px solid #ced4da",
        }}
      >
        <div className="w-100">
          <FloatingLabel controlId="floatingTextarea2" label="Nhập trả lời" className="w-100">
            <Form.Control placeholder="Leave a comment here" onChange={(e) => setNewComment(e.target.value)} />
          </FloatingLabel>
          <div className="text-center">
            <Button
              variant="secondary"
              size="sm"
              className="mt-2" //
              value={newComment}
              onClick={(e) => handleSubmit(e, selectorComment)}
            >
              Trả lời
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
