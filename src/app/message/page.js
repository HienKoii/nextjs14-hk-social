"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Row, Col, Form, InputGroup, Container, Card } from "react-bootstrap";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

import ImagesAvatar from "@/src/components/Images/ImagesAvatar";
import { useFriends } from "@/src/context/FriendsContext";
import { getLastName } from "@/src/utils";
import { useMessages } from "@/src/context/MessagesContext";
import { useUser } from "@/src/context/UserContext";

export default function MessagePage() {
  const router = useRouter();

  const { friends } = useFriends();
  const { user } = useUser();
  const { listChatUsers } = useMessages();
  const [isSearch, setIsSearch] = useState(false);

  const handleRouter = (id) => {
    router.push(`/message/${id}`);
  };

  return (
    <Container className="bg-white h-100 px-5 card">
      <Row>
        <Col sm={12} className="p-0 position-relative">
          <div className="mb-2">
            <h1>Đoạn chat</h1>
            <div className="d-flex align-items-center justify-content-start">
              {isSearch && (
                <div
                  className="hk-fa-arrowLeft me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsSearch(false);
                    setIsSearch("");
                  }}
                >
                  <FaArrowLeft />
                </div>
              )}
              <Form className="d-flex w-100">
                <InputGroup size={22}>
                  <InputGroup.Text>
                    <FaSearch className="search-icon" />
                  </InputGroup.Text>
                  <Form.Control type="search" placeholder="Tìm kiếm trên đoạn chat..." aria-label="Search" onFocus={() => setIsSearch(true)} />
                </InputGroup>
              </Form>
            </div>
          </div>
          {isSearch ? (
            <Card style={{ height: "55vh" }}>show tìm kiếm</Card>
          ) : (
            <div
              className="d-flex  hk-scrollbar hidden-scroll-y gap-2" //
              style={{ overflowY: "auto", maxHeight: "70vh" }}
            >
              {friends &&
                friends?.map((item, index) => {
                  return (
                    <div
                      onClick={() => handleRouter(item.id)}
                      key={index} //
                      style={{ cursor: "pointer" }}
                      className="d-flex flex-column align-items-center mb-2 "
                    >
                      <ImagesAvatar id={item.id} url={item.avatar} isCircle />

                      {/* Hiển thị trên màn hình nhỏ và ẩn trên màn hình lớn */}
                      <strong> {getLastName(item.fullName)} </strong>
                    </div>
                  );
                })}
            </div>
          )}
        </Col>
        <Col sm={12} className="p-0">
          <div>
            {listChatUsers &&
              listChatUsers.map((item, index) => {
                // danh sách tin nhắn các cuộc trò chuyện của user và 1 tin nhắn gần đây nhất với user đó
                return (
                  <div
                    onClick={() => handleRouter(item.chat_user_id)}
                    key={index} //
                    style={{ cursor: "pointer" }}
                    className={`mb-2 d-flex gap-2`}
                  >
                    <ImagesAvatar id={item.chat_user_id} url={item.avatar} isCircle />
                    <div>
                      <strong>{item.fullName}</strong>
                      <div className={`hk-center ${user?.id === item.sender_id ? "text-muted" : item.is_read ? "text-muted" : "fw-bold"} `}>
                        {user?.id == item.sender_id && <span>Bạn: </span>}
                        <p className={`${item?.is_deleted ? "fst-italic" : ""}`}>
                          {}
                          {!item?.is_deleted ? item?.latest_message || "Chưa có tin nhắn gần đây" : "Tin nhắn đã được xóa"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
