"use client";
import { useUser } from "@/src/context/UserContext";
import { Image, Button, Card, Row, Modal } from "react-bootstrap";
import { AiOutlineCamera } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { useState } from "react";

import ImagesAvatar from "../Images/ImagesAvatar";
import AddFriends from "../Friends/AddFriends";
import OneGallery from "../Gallery/OneGallery";
import { useProfile } from "@/src/context/ProfileContext";
import CancelFriend from "../Friends/CancelFriend";
import UnFriends from "../Friends/UnFriend";
import { useFriends } from "@/src/context/FriendsContext";

const ProfileHeader = ({ userData }) => {
  const { user } = useUser();
  const { handleSubmitUpload } = useProfile();
  const { friendRequests } = useFriends();

  const [isFriendRequestPending, setIsFriendRequestPending] = useState(userData?.isFriendRequestPending);
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadType(type);
    }
  };

  const handleOpenModal = (type) => {
    setUploadType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUploadType(""); // Reset lại loại tải lên
    setSelectedFile(null); // Reset lại file đã chọn
  };

  const findFriends = userData?.friends?.find((item) => item.id === user?.id);

  return (
    <Row className="p-2 pt-0">
      <Card className="p-0">
        <div className="cover-photo" style={{ maxHeight: "400px", overflow: "hidden", position: "relative" }}>
          <OneGallery>
            <Image
              src={userData?.id && userData?.background ? `/uploads/background/${userData?.id}/${userData?.background}` : "/uploads/background/a.jpg"} //
              alt="Avatar"
              width={1000}
              height={400}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </OneGallery>

          {user?.id === userData?.id && (
            <div style={{ position: "absolute", right: "0", bottom: "1%" }}>
              <label htmlFor="bg-upload" className="bg-secondary p-1" style={{ cursor: "pointer", borderRadius: "999px" }} onClick={() => handleOpenModal("background")}>
                <AiOutlineCamera size={24} className="text-white" />
              </label>
              <input
                type="file"
                id="bg-upload"
                accept="image/*" //
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, "background")}
              />
            </div>
          )}
        </div>
        <Card.Body>
          <div className="d-flex align-items-center w-100 mb-3 mt-1" style={{ position: "relative" }}>
            <div style={{ minWidth: "120px" }}>
              <OneGallery>
                <ImagesAvatar
                  id={userData?.id}
                  url={userData?.avatar}
                  w={120} //
                  h={120}
                  isCircle
                  width={800}
                  height={600}
                  src={`/uploads/avatar/${userData?.id}/${userData?.avatar}`}
                  style={{ position: "absolute", top: "-56px", left: "0", objectFit: "cover" }}
                />
              </OneGallery>

              {user?.id === userData?.id && (
                <div style={{ position: "absolute", left: "83px", bottom: "1%" }}>
                  <label htmlFor="avatar-upload" className="bg-secondary p-1" style={{ cursor: "pointer", borderRadius: "999px" }} onClick={() => handleOpenModal("avatar")}>
                    <AiOutlineCamera size={24} className="text-white" />
                  </label>
                  <input
                    type="file" //
                    id="avatar-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e, "avatar")}
                  />
                </div>
              )}
            </div>

            <div className="w-100 mx-2">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-1 fs-3 fw-bold">{userData?.fullName}</p>
                {userData?.tick ? <Image src={`/images/tick.png`} alt="Avatar" width={25} className="rounded-circle" /> : null}
              </div>
              <p>{userData?.friends?.length > 0 ? `${userData?.friends?.length} bạn` : "Chưa có bạn nào"}</p>
              <div className="d-flex w-100 gap-2">
                {user?.id !== userData?.id && (
                  <>
                    {!findFriends ? (
                      <>
                        {isFriendRequestPending ? (
                          <CancelFriend
                            setIsFriendRequestPending={setIsFriendRequestPending}
                            receiverId={userData?.id} //
                            className={"w-100 d-flex justify-content-center align-items-center"}
                          />
                        ) : (
                          <AddFriends
                            isFriends={friendRequests?.some((item) => item.sender_id === userData?.id)}
                            setIsFriendRequestPending={setIsFriendRequestPending}
                            className={"w-100 d-flex justify-content-center align-items-center"} //
                            friendId={userData?.id}
                          />
                        )}
                      </>
                    ) : (
                      <UnFriends
                        isFriends={findFriends}
                        className={"w-100 d-flex justify-content-center align-items-center"} //
                        friendId={userData?.id}
                      />
                    )}

                    <Button variant="primary" className="w-100 d-flex justify-content-center align-items-center">
                      <FaFacebookMessenger className="me-1" />
                      <span>Nhắn tin</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
        {user?.biography && userData?.biography && (
          <Card.Footer className="mt-4 text-center py-1">
            <p>{user?.id === userData?.id ? user?.biography : userData?.biography}</p>
          </Card.Footer>
        )}
      </Card>

      {/* Modal tải lên ảnh */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{uploadType === "background" ? "Tải lên ảnh bìa" : "Tải lên ảnh đại diện"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile && <Image src={URL.createObjectURL(selectedFile)} alt="Selected" fluid style={{ marginBottom: "10px" }} />}
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, uploadType)} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary" //
            onClick={() => handleSubmitUpload(uploadType, selectedFile, user?.id)}
            disabled={!selectedFile}
          >
            Đăng ảnh
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default ProfileHeader;
