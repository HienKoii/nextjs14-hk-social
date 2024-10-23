import Link from "next/link";
import React from "react";
import ImagesAvatar from "../Images/ImagesAvatar";
import { Dropdown, Image, ListGroup } from "react-bootstrap";
import { FaCircle, FaEllipsisH, FaEye, FaFacebookMessenger } from "react-icons/fa";
import AddFriends from "../Friends/AddFriends";
import { isToken } from "@/src/utils";
import UnFriends from "./UnFriend";
import { useSocket } from "@/src/context/SocketContext";

export default function ListFriends({ data, sm = false, scroll = false, left = false, isAddFriend = false, isShowOnline = true }) {
  const { listUserOnline } = useSocket();

  if (!isToken()) {
    return <></>;
  }

  return (
    <ListGroup className={`mb-3 ${scroll ? "hk-scrollbar on" : ""}`}>
      {data &&
        data.map((item, idx) => {
          return (
            <ListGroup.Item key={idx} className={`p-0`}>
              <div className={`d-flex justify-content-start align-items-center ${sm ? "hk-sm" : "hk-xl"}`}>
                <Link href={`/profile/${item.id}`} className="position-relative">
                  <ImagesAvatar id={item.id} url={item.avatar} isCircle className={"object-fit-cover"} />
                  {isShowOnline && listUserOnline[item.id] && (
                    <FaCircle
                      style={{ color: "#31A24C", fontSize: "12px", bottom: "0px", right: "0px" }} //
                      className="position-absolute"
                    />
                  )}
                </Link>
                <div className="ms-1">
                  <Link href={`/profile/${item.id}`} className="d-flex justify-content-start align-items-center gap-1">
                    <div className="w-100 d-flex flex-column">
                      <span className="fw-bold"> {item.fullName} </span>
                    </div>
                    {item.tick ? (
                      <Image
                        src={`/images/tick.png`} //
                        alt="Avatar"
                        width={15}
                        className="rounded-circle"
                      />
                    ) : null}
                  </Link>
                  <span className="text-muted">
                    {}
                    {item?.mutualFriendsCount <= 0 ? "Không bạn chung" : `${item?.mutualFriendsCount} bạn chung`}
                  </span>
                </div>
                <div className="flex-grow-1 d-flex justify-content-end ">
                  <Dropdown className={`${left ? "left" : ""}`}>
                    <Dropdown.Toggle variant="link" id="dropdown-menu-align-responsive-1" className="pt-0 pe-1 no-caret">
                      <FaEllipsisH />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} href={`/profile/${item.id}`} className="d-flex align-items-center gap-1 mb-2">
                        <FaEye size={20} />
                        <span>{item.fullName} </span>
                      </Dropdown.Item>
                      <Dropdown.Item className="d-flex align-items-center gap-1 mb-2">
                        <FaFacebookMessenger size={20} />
                        <span> Nhắn tin </span>
                      </Dropdown.Item>
                      {!isAddFriend ? (
                        <AddFriends
                          sizeIcon={20}
                          as={Dropdown.Item}
                          className={"d-flex align-items-center gap-1 mb-2"} //
                          friendId={item.id}
                        />
                      ) : (
                        <UnFriends
                          friendId={item.id} //
                          sizeIcon={20}
                          as={Dropdown.Item}
                          className={"d-flex align-items-center gap-1 mb-2"}
                        />
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
}
