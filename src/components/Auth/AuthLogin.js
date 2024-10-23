import Link from "next/link";
import React, { useState } from "react";
import { Nav, NavDropdown, Offcanvas, Button } from "react-bootstrap";
import ImagesAvatar from "../Images/ImagesAvatar";
import { FaAngleDown } from "react-icons/fa";
import { useUser } from "@/src/context/UserContext";

export default function AuthLogin({ isMobile = false }) {
  const { handleLogout, user } = useUser();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <>
      <Nav>
        {isMobile ? (
          <>
            {/* Khi là Mobile, dùng Offcanvas */}
            <Button variant="link" onClick={handleShowOffcanvas} className="p-0 d-flex align-items-center  position-relative">
              <ImagesAvatar w={39} h={39} id={user?.id} url={user?.avatar} isCircle className={"object-fit-cover"} />
              <FaAngleDown size={20} className="position-absolute" style={{ right: "10px", bottom: "-9px" }} />
            </Button>

            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className="hk">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{user?.fullName}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column">
                  <Nav.Link as={Link} href={`/profile/${user?.id}`} onClick={handleCloseOffcanvas}>
                    Thông tin cá nhân
                  </Nav.Link>
                  <Nav.Link as={Link} href="/" onClick={handleCloseOffcanvas}>
                    Settings
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href="/"
                    onClick={() => {
                      handleLogout();
                      handleCloseOffcanvas();
                    }}
                  >
                    Đăng xuất
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        ) : (
          <>
            {/* Khi là Desktop, dùng NavDropdown */}
            <NavDropdown
              className={`w-100 no-caret ${isMobile ? "hk-sm" : "hk-lg"}`}
              id="basic-nav-dropdown"
              title={
                <div className="d-flex justify-content-end align-items-center">
                  <span className={`ms-1 fw-bold`}>{user?.fullName}</span>
                  <div style={{ position: "relative" }}>
                    <ImagesAvatar w={50} h={50} id={user?.id} url={user?.avatar} isCircle className={"object-fit-cover"} />
                    <FaAngleDown size={20} className={`hk-icon-faAngleDown ${isMobile ? "hk-sm" : "hk-lg"}`} />
                  </div>
                </div>
              }
            >
              <NavDropdown.Item as={Link} href={`/profile/${user?.id}`}>
                Thông tin cá nhân
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} href="/login" onClick={() => handleLogout()}>
                Đăng xuất
              </NavDropdown.Item>
            </NavDropdown>
          </>
        )}
      </Nav>
    </>
  );
}
