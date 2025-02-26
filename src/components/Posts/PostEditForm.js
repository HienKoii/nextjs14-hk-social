import { Button, Form, Image, Modal } from "react-bootstrap";
import { useState } from "react";

import ImagesAvatar from "../Images/ImagesAvatar";
import PostSelectStatus from "./PostSelectStatus";
import { usePosts } from "@/src/context/PostsContext";
import { useProfile } from "@/src/context/ProfileContext";

export default function PostEditForm({ post, showEditModal, handleCloseEditModal }) {
  const [editedContent, setEditedContent] = useState(post.content);
  const [status, setStatus] = useState(post.status);
  const [loading, setLoading] = useState(false);
  const { handleUpdatePost } = usePosts();
  const { setDataPostsUser } = useProfile();

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await handleUpdatePost(post.id, editedContent, status);
      console.log("Xử lý cập nhật bài viết: ", res);
      if (res.status === 200) {
        // // Cập nhật lại danh sách bài viết
        // setDataPostsUser((prevPosts) => prevPosts.map((prev) => (prev.id === post.id ? { ...prev, content: editedContent, status: status, updated_at: new Date().toISOString() } : prev)));
        handleCloseEditModal();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết: ", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowX: "hidden" }} className="hk-scrollbar">
          <div className="d-flex justify-content-start align-items-center text-center">
            <ImagesAvatar id={post?.user_id} url={post?.avatar} isCircle className={"me-2 object-fit-cover"} style={{ height: "100%" }} />
            <strong>{post?.fullName}</strong>
            {post.tick ? <Image src={`/images/tick.png`} alt="Avatar" width={15} className="rounded-circle ms-1" /> : null}
          </div>
          <Form className="my-2">
            <PostSelectStatus
              sizeIcon={15}
              defaultValue={status}
              onChange={(option) => {
                setStatus(option.value);
              }}
            />
            <Form.Group controlId="editPostContent" className="mt-3">
              <Form.Label>Nội dung bài viết</Form.Label>
              <Form.Control as="textarea" rows={3} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
            </Form.Group>
          </Form>
          <div className="image-grid">
            {JSON.parse(post?.images)?.map((imgSrc, index) => (
              <div key={index} className="image-item">
                <Image src={`/uploads/posts/${imgSrc}`} alt={`image-${index}`} className="image" />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
