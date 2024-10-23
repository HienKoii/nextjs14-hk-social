"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";

import Header from "@/src/components/Layouts/Header";
import Loading from "@/src/components/Loading";
import { useUser } from "@/src/context/UserContext";

export default function Main({ children }) {
  const pathname = usePathname();
  const isProfilePage = /^\/profile\/\w+$/.test(pathname);
  const isMessagePage = /^\/message\/\w+$/.test(pathname);

  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const { loading: userLoading } = useUser();

  const isLoading = userLoading || loading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (headerRef.current) {
        // Lấy chiều cao của header khi component đã mount
        setHeaderHeight(headerRef.current.offsetHeight);
      }

      const handleResize = () => {
        if (headerRef.current) {
          // Cập nhật chiều cao header khi cửa sổ thay đổi kích thước
          setHeaderHeight(headerRef.current.offsetHeight);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading isPriority />;
  }

  return (
    <>
      <div ref={headerRef} className="header bs-hk bg-white">
        <Header />
      </div>

      <main className="p-0" style={{ height: "100vh" }}>
        <Row className="h-100" style={{ paddingTop: headerHeight + 8 }}>
          <Col xs={12} className="p-0">
            <div //
              className={` h-100 ${pathname === "/" || pathname === "/message" || isMessagePage || isProfilePage ? "p-0" : "container card"}`}
            >
              {children}
            </div>
          </Col>
        </Row>
      </main>
    </>
  );
}
