"use client";

import { Container, Row, Col, Tab, Nav, Card } from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import { useFriends } from "@/src/context/FriendsContext";
import { FaUserPlus, FaUsers, FaUserFriends } from "react-icons/fa";

export default function FriendsLayout({ children }) {
  const { friendRequests } = useFriends();
  const ListTab = ["friends", "requests", "suggest"];
  const [activeKey, setActiveKey] = useState(ListTab[0]);

  return (
    <>
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Row className="pb-3">
          {/* Cột bên trái với tab */}
          <Col lg={2} sm={12} className="mt-3">
            <Nav variant="pills" className="flex-lg-column gap-2">
              <Nav.Item as={Col}>
                <Nav.Link
                  eventKey={ListTab[0]}
                  as={Link} //
                  href={`/${ListTab[0]}`}
                  className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 flex-wrap"
                >
                  <FaUsers size={24} /> <span className="d-none d-md-block">Danh sách</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as={Col}>
                <Nav.Link
                  eventKey={ListTab[1]}
                  as={Link} //
                  className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 flex-wrap"
                  href={`/friends/${ListTab[1]}`}
                >
                  <FaUserFriends size={24} /> <span className="d-none d-md-block"> Lời mời</span> <span>{`(${friendRequests.length})`}</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as={Col}>
                <Nav.Link
                  eventKey={ListTab[2]} //
                  as={Link}
                  className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 flex-wrap"
                  href={`/friends/${ListTab[2]}`}
                >
                  <FaUserPlus size={22} />
                  <span className="d-none d-md-block">Gợi ý</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Cột bên phải với nội dung */}
          <Col lg={10} sm={12} className="mt-3">
            <Tab.Content>
              {ListTab.map((item, inx) => {
                return (
                  <Tab.Pane key={inx} eventKey={item}>
                    {children}
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
