// components/comments/CommentsModal.js
import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import Cookies from "js-cookie";

import CommentsBox from "./CommentsBox";
import { useComments } from "@/src/context/CommentsContext";
import { useUser } from "@/src/context/UserContext";
import ImagesAvatar from "../Images/ImagesAvatar";

export default function CommentsModal({ show, handleClose, handleTotalComments }) {
  const token = Cookies.get("token");

  const { selectedPost, comments, handleAddComment, loading } = useComments();
  const { user } = useUser();
  
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e, post) => {
    e.preventDefault();

    if (!token) return;
    if (!newComment) {
      return alert("Vui lòng nhập bình luận");
    }
    const data = {
      post_id: post.id,
      content: newComment,
      parent_id: null,
    };

    setNewComment("");
    handleTotalComments(1);
    await handleAddComment(data);
  };
  return (
    <Modal show={show} onHide={handleClose} fullscreen={"md-down"}>
      <Modal.Header closeButton>
        <Modal.Title>Bình luận bài viết của: {selectedPost?.fullName} </Modal.Title>
      </Modal.Header>
      <Modal.Body className="hk-scrollbar" style={{ maxHeight: "60vh", overflowX: "hidden" }}>
        {comments && comments.length > 0 ? <CommentsBox /> : <p className="text-center w-100">Chưa có bình luận nào. Hãy là người đầu tiên bình luận</p>}
      </Modal.Body>
      <Form onSubmit={(e) => handleSubmit(e, selectedPost)} className="p-2" style={{ maxHeight: "40vh", borderTop: "1px solid black" }}>
        <Form.Group controlId="newComment" className="py-3 d-flex">
          <ImagesAvatar id={user?.id} url={user?.avatar} isCircle className={"me-2"} />
          <Form.Control
            as="textarea"
            rows={3} //
            placeholder={`${token ? "Nhập bình luận..." : "Đăng nhập để bình luận !"}`}
            value={newComment}
            disabled={token ? false : true}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <div className="text-center">
          <Button variant="primary" type="submit" className="mt-2" disabled={token ? false : true}>
            Bình luận
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
