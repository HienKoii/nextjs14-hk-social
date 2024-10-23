import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { FaEdit, FaEllipsisH, FaTrash } from "react-icons/fa";

import { useUser } from "@/src/context/UserContext";
import { usePosts } from "@/src/context/PostsContext";
import { isToken } from "@/src/utils";
import { usePathname } from "next/navigation";
import { useProfile } from "@/src/context/ProfileContext";
import { useState } from "react";
import PostEditForm from "./PostEditForm";

export default function PostMenu({ post }) {
  const pathname = usePathname();

  const { user } = useUser();
  const { handleDeletePost } = usePosts();
  const { fetchUserProfile } = useProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleOpenConfirmModal = () => setShowConfirmModal(true); // Open confirm modal
  const handleCloseConfirmModal = () => setShowConfirmModal(false); // Close confirm moda

  const handleSubmitDelete = async (e, postId) => {
    e.preventDefault();
    await handleDeletePost(postId);
    const isProfilePage = /^\/profile\/\w+$/.test(pathname);
    if (isProfilePage) {
      fetchUserProfile();
    }
    handleCloseConfirmModal();
  };

  return (
    <>
      {isToken() && user?.id === post?.user_id && (
        <>
          <Dropdown>
            <Dropdown.Toggle variant="Secondary" id={`dropdown-button-drop-start`} className="no-caret py-0">
              <FaEllipsisH size={24} className="hk-icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className="d-flex justify-content-start align-items-center" onClick={() => handleOpenEditModal()}>
                <FaEdit className="me-2" />
                <span>Sửa</span>
              </Dropdown.Item>
              <Dropdown.Item className="d-flex justify-content-start align-items-center" onClick={() => handleOpenConfirmModal()}>
                <FaTrash className="me-2" />
                <span>Xóa</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
      {/* Edit Modal */}
      <PostEditForm post={post} showEditModal={showEditModal} handleCloseEditModal={handleCloseEditModal} />

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={(e) => handleSubmitDelete(e, post.id)}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
