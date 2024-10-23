"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { validateInput } from "@/src/utils";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy token từ URL
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra password
    if (!validateInput(password)) {
      return setError("Mật khẩu chỉ được chứa các ký tự thường không dấu");
    }
    if (password.length > 20) {
      return setError("Mật khẩu không được vượt quá 20 ký tự");
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      // Gửi yêu cầu đến API để đặt lại mật khẩu
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      setSuccessMessage(response.data.message);
      setError(""); // Reset lại thông báo lỗi (nếu có)
      setTimeout(() => {
        router.push("/login"); // Chuyển hướng đến trang đăng nhập sau 3 giây
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4 text-center">Đặt lại mật khẩu</h3>
          {successMessage ? (
            <Alert variant="success">{successMessage}</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword" className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <Form.Control type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}

              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading && <Spinner animation="border" variant="light" size="sm" />} Đặt lại mật khẩu
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
