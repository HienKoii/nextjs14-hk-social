"use client";
import { Nav, Navbar } from "react-bootstrap";
import { AiOutlineHome } from "react-icons/ai";
import { FaCommentDots, FaUserFriends } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFriends } from "@/src/context/FriendsContext";
import AuthLogin from "../Auth/AuthLogin";
import { isToken } from "@/src/utils";
import { useUser } from "@/src/context/UserContext";
import { useNotifications } from "@/src/context/NotificationsContext";

const NavItemCustom = ({ item, index, pathname, badgeCount }) => (
  <div className="w-100 hk-list-btn">
    <Nav.Link
      as={Link}
      href={item.path}
      style={{ position: "relative" }} //
      className={`d-flex justify-content-center align-items-center h-100 gap-1 ${pathname === item.path && "text-primary"}`}
    >
      {item.icon}
      {pathname === item.path && <div className="divider-nav hk-sm"></div>}
      {badgeCount > 0 && <div className="hk-nav-after position-absolute hk-lg text-white">{badgeCount <= 99 ? <>{badgeCount}</> : "99+"}</div>}
    </Nav.Link>
  </div>
);

export default function NavBar({ xsShow }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { friendRequests } = useFriends();
  const { unreadNotifications, unreadMessages } = useNotifications();

  const dataNavLink = [
    { title: "Trang chủ", path: "/", icon: <AiOutlineHome size={24} />, isAfter: false },
    { title: "Bạn bè", path: "/friends", icon: <FaUserFriends size={24} />, isAfter: true },
    { title: "Tin nhắn", path: "/message", icon: <FaCommentDots size={24} />, isAfter: true },
    { title: "Thông báo", path: "/notifications", icon: <IoNotificationsOutline size={24} />, isAfter: true },
  ];

  const badgeCounts = [
    null, // Không có badge cho Trang chủ
    friendRequests.length, // Badge cho Bạn bè
    unreadMessages.length, // Badge cho Tin nhắn
    unreadNotifications.length, // Badge cho Thông báo
  ];

  return (
    <>
      {xsShow ? (
        <Nav className="w-100 gap-2 flex-row">
          {dataNavLink.map((item, index) => (
            <NavItemCustom key={index} item={item} index={index} pathname={pathname} badgeCount={badgeCounts[index]} />
          ))}
          {isToken() && <AuthLogin isMobile user={user} />}
        </Nav>
      ) : (
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="w-100 gap-2">
            {dataNavLink.map((item, index) => (
              <NavItemCustom key={index} item={item} index={index} pathname={pathname} badgeCount={badgeCounts[index]} />
            ))}
          </Nav>
        </Navbar.Collapse>
      )}
    </>
  );
}
