"use client";
import { Button, Card, Form, Image, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePosts } from "@/src/context/PostsContext";
import ImagesAvatar from "../Images/ImagesAvatar";
import PostSelectStatus from "./PostSelectStatus";


export default function PostForm({ user }) {
  const { handleCreatePots } = usePosts();
  const pathname = usePathname();
  const isProfilePage = /^\/profile\/\w+$/.test(pathname);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false); // Trạng thái tải


  // Hàm xử lý khi thay đổi hình ảnh
  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  // Hàm xử lý khi gửi biểu mẫu
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Vui lòng nhập nội dung !!!");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("content", content);
    formData.append("id", user.id);
    formData.append("status", status);
    images.forEach((image) => {
      formData.append("images", image); // Đảm bảo rằng tên trường là "images"
    });

    try {
      const res = await handleCreatePots(formData);
      if (res) {
        setContent("");
        setImages([]);
      }
      console.log("Kết quả xử lý đăng bài viết: ", res);
    } catch (error) {
      console.log("handleSubmit đăng post");
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  return (
    <>
      {/* Phần tạo bài viết */}
      <Card className="mb-3 px-3">
        <Card.Body>
          <div className="d-flex">
            <Link href={isProfilePage ? "#" : `profile/${user?.id}`}>
              <ImagesAvatar id={user?.id} url={user?.avatar} isCircle className={"object-fit-cover"} />
            </Link>
            <Form className="w-100 ps-2" onSubmit={handleSubmit}>
              <Form.Group controlId="formPost">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Bạn đang nghĩ gì?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)} // Cập nhật nội dung bài viết
                />
              </Form.Group>

              <div className="d-flex justify-content-start align-items-center my-2 gap-2">
                <Form.Group>
                  {/* Input file được ẩn đi */}
                  <Form.Control type="file" multiple onChange={handleImagesChange} style={{ display: "none" }} id="fileInput" />

                  {/* Ảnh thay thế cho input file */}
                  <Button
                    variant="outline-secondary"
                    className="d-flex justify-content-center align-items-center" //
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <Image src="/images/addFile.png" alt="Avatar" className="me-1" />
                    <span className="text-muted fw-bold">Ảnh/Video</span>
                  </Button>
                </Form.Group>

                <PostSelectStatus
                  onChange={(option) => {
                    setStatus(option.value);
                  }}
                />
              </div>

              <div className="mt-2 d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" variant="light" size="sm" /> : <FiSend />} Đăng bài
                </Button>
              </div>

              {/* Hiển thị hình ảnh đã chọn */}
              <div className="mt-2 d-flex flex-wrap">
                {images &&
                  images.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded image ${index + 1}`}
                        width={100} // Điều chỉnh kích thước hình ảnh
                        className="me-2 mb-2" // Thêm khoảng cách giữa các hình ảnh
                        onError={(e) => {
                          e.target.src = null;
                        }}
                      />
                    );
                  })}
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
