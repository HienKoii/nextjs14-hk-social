"use client";

import { Container, Row, Card, Tab, Nav, Col } from "react-bootstrap";

import ProfileHeader from "@/src/components/Profile/ProfileHeader";
import PostsItem from "@//src/components/Posts/PostsItem";
import { useUser } from "@/src/context/UserContext";
import ProfileDetails from "@//src/components/Profile/ProfileDetails";
import ProfileShowImgs from "@//src/components/Profile/ProfileShowImgs";
import PostForm from "@/src/components/Posts/PostForm";
import { isToken } from "@/src/utils";
import { useProfile } from "@/src/context/ProfileContext";
import ImagesLoading from "@/src/components/Images/ImagesLoading";
import { useEffect } from "react";

export default function Profile() {
  const { dataUser, dataPostsUser, loading, fetchUserProfile } = useProfile();
  const { user } = useUser();

  const listTab = [
    {
      key: "detail",
      name: "Chi tiết",
      children: <ProfileDetails userLogin={user} userProfile={dataUser} />,
    },
    {
      key: "imgs",
      name: "Ảnh",
      children: <ProfileShowImgs userLogin={user} userProfile={dataUser} />,
    },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <ImagesLoading />;
  }
  return (
    <Container>
      <ProfileHeader userData={dataUser} />
      <Row>
        <Col lg={6} className="p-0">
          <Tab.Container id="left-tabs-example" defaultActiveKey={listTab[0].key}>
            <div className="p-2">
              <Card>
                <Card.Header>
                  <Nav variant="pills" className="gap-2">
                    {listTab.map((item, inx) => {
                      return (
                        <Nav.Item key={inx} className="hk">
                          <Nav.Link eventKey={item.key}>{item.name}</Nav.Link>
                        </Nav.Item>
                      );
                    })}
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    {listTab.map((item, inx) => {
                      return (
                        <Tab.Pane key={inx} eventKey={item.key}>
                          {item.children}
                        </Tab.Pane>
                      );
                    })}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </div>
          </Tab.Container>
        </Col>
        <Col lg={6} className="p-0">
          <div className="p-2">
            {isToken() && user?.id === dataUser?.id && <PostForm user={user} />}
            {dataPostsUser && dataPostsUser.length > 0 ? (
              dataPostsUser?.map((item, index) => {
                return <PostsItem key={index} post={item} />;
              })
            ) : (
              <Card>
                <Card.Body>
                  <Card.Text className="text-center">Chưa có bài viết nào !!!</Card.Text>
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
