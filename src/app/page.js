"use client";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaUsers, FaUserPlus } from "react-icons/fa";

import ListFriends from "@/src/components/Friends/ListFriends";
import PostForm from "@/src/components/Posts/PostForm";
import PostsList from "@/src/components/Posts/PostsList";
import { useFriends } from "@/src/context/FriendsContext";

import { useUser } from "@/src/context/UserContext";
import { isToken } from "@/src/utils";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const { user } = useUser();
  const { friends, suggestedFriends } = useFriends();
  const colRef = useRef(null); // Tham chiếu tới thẻ Col
  const [colWidth, setColWidth] = useState(0); // State để lưu width của thẻ Col

  useEffect(() => {
    const handleResize = () => {
      if (colRef.current) {
        setColWidth(colRef.current.offsetWidth); // Gán width của thẻ Col cho state
      }
    };

    // Gọi khi component mount
    handleResize();

    // Cập nhật width khi thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container className="p-0">
      <Row className="hk-home">
        <Col lg={3} className="d-none d-lg-block" ref={colRef}>
          <Card className="py-3 hk-fixed" style={{ width: colWidth - 16 }}>
            <div className="d-flex justify-content-center align-items-center text-center gap-1 mb-2">
              <FaUsers size={24} />
              <h5 className="m-0 fw-bold">Danh sách bạn bè</h5>
            </div>
            <ListFriends data={friends} sm left isAddFriend />
          </Card>
        </Col>
        <Col xs={12} lg={6} className="p-0">
          {user && isToken() && <PostForm user={user} />}
          <PostsList />
        </Col>
        <Col lg={3} className="d-none d-lg-block" ref={colRef}>
          <Card className="py-3 hk-fixed" style={{ width: colWidth - 16 }}>
            <div className="d-flex justify-content-center align-items-center text-center gap-1  mb-2">
              <FaUserPlus size={24} />
              <h5 className="m-0 fw-bold">Gợi ý kết bạn</h5>
            </div>
            <ListFriends data={suggestedFriends} sm scroll />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
