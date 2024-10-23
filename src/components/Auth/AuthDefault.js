import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";

const AuthDefault = ({ onClick, isMobile = false }) => {
  return (
    <>
      <div className={isMobile ? "d-flex justify-content-center align-items-center" : ""}>
        <Button as={Link} href="/login" passHref variant="outline-info" className="me-2 " onClick={onClick}>
          Đăng Nhập
        </Button>
        <Button as={Link} href="/register" passHref variant="info" onClick={onClick}>
          Đăng Ký
        </Button>
      </div>
    </>
  );
};

export default AuthDefault;
