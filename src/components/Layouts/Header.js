import Navbar from "react-bootstrap/Navbar";
import { Col, Container, Form, Image, Row } from "react-bootstrap";
import Cookies from "js-cookie";

import NavBar from "../NavBar";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import AuthDefault from "../Auth/AuthDefault";
import Auth from "../Auth";
import Search from "../search";

export default function Header() {
  const token = Cookies.get("token");

  return (
    <>
      <Container className="p-0">
        <Navbar expand="lg" className="min-h-fixed d-flex justify-content-center align-items-center w-100">
          <Row className="w-100 align-items-center">
            <Col sm={12} lg={3} xs={12} className="p-0">
              <div className="d-flex justify-content-center align-items-center">
                <Navbar.Brand as={Link} href="/" className="m-0" style={{ width: "50px", height: "50px" }}>
                  <Image src="/images/logo.png" alt="logo" style={{ width: "100%", height: "auto" }} />
                </Navbar.Brand>
                <Search />
              </div>
              <div className="d-block d-lg-none">
                <div className="w-100 text-center my-2">{!token && <AuthDefault />}</div>
              </div>
              <div className="d-block d-lg-none">
                <Col sm={12}>
                  <NavBar xsShow />
                </Col>
              </div>
            </Col>

            <Col lg={6} className="d-none d-lg-block">
              <NavBar />
            </Col>

            <Col lg={3} xs={12} className="text-end d-none d-lg-block pe-0">
              <Auth />
            </Col>
          </Row>
        </Navbar>
      </Container>
    </>
  );
}
