"use client";
import { Card, Col, Image, Row } from "react-bootstrap";

import ImagesAvatar from "@/src/components/Images/ImagesAvatar";
import { useFriends } from "@/src/context/FriendsContext";
import AcceptFriends from "@/src/components/Friends/AcceptFriends";
import RejectFriends from "@/src/components/Friends/RejectFriends";
import Link from "next/link";

export default function FriendsRequests() {
  const { friendRequests } = useFriends();

  return (
    <>
      <h4>
        Lời mời kết bạn <span>{`(0)`}</span>{" "}
      </h4>
      <Row style={{ minHeight: "400px" }}>
        {friendRequests && friendRequests.length > 0 ? (
          <>
            {friendRequests.map((request, index) => {
              return (
                <Col key={index} xs={6} md={6} lg={3} className="mb-2">
                  <Card className="mt-3">
                    <Link href={`/profile/${request.sender_id}`} className="w-100">
                      <ImagesAvatar
                        id={request.sender_id}
                        url={request.avatar}
                        h={220} //
                        className={"hk object-fit-cover w-100"}
                      />
                    </Link>
                    <Card.Body>
                      <div>
                        <Link href={`/profile/${request.sender_id}`}>
                          <span className="fw-bold fs-6">{request.fullName}</span>
                          {request.tick ? (
                            <Image
                              src={`/images/tick.png`} //
                              alt="Avatar"
                              width={15}
                              className="rounded-circle ms-1"
                            />
                          ) : null}
                        </Link>
                      </div>
                      <Card.Text className="text-muted">{request.mutualFriendsCount > 0 && `${mutualFriendsCount} bạn chung`}</Card.Text>
                      <div className="w-100 mt-2">
                        <AcceptFriends requestId={request.id} senderId={request.sender_id} className={"w-100 mb-2"} />
                        <RejectFriends senderId={request.sender_id} className={"w-100"} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </>
        ) : (
          <> Không có lời mời kết bạn nào </>
        )}
      </Row>
    </>
  );
}
