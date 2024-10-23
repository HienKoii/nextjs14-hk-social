"use client";
import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import Link from "next/link";
import { socket } from "@/src/socket";

export default function Login() {
  const router = useRouter();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Đổi tên từ email thành identifier
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      Cookies.set("token", response.data.token, { expires: 1 });
      setUser(response.data.user);

      // Gửi token cho socket khi đăng nhập thành công
      socket.io.opts.query = { token: response.data.token };
      socket.connect(); // Kết nối lại với token

      setSuccess("Đăng nhập thành công!");
      router.push("/");
      setError(null);
    } catch (err) {
      setError(err.response?.data.message || "Đăng nhập không thành công");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4 p-3">
      <h2 className="text-center">Đăng Nhập</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formIdentifier">
          <Form.Label>Tài khoản hoặc Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập Tài khoản hoặc email của bạn" //
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Mật Khẩu</Form.Label>
          <Form.Control
            type="password" //
            placeholder="Nhập mật khẩu của bạn"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="w-100 mt-3 d-flex justify-content-center align-items-center">
          <span>Bạn chưa có tài khoản?</span>
          <Button as={Link} href={"/register"} variant="link" className="ps-1">
            Đăng ký ngay !
          </Button>
        </div>
        <Button as={Link} href={"/forgot-password"} variant="link" className="w-100 mt-3">
          Quên mật khẩu ?
        </Button>
        <div className="text-center">
          <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
            {loading && <Spinner animation="border" variant="light" size="sm" />} Đăng Nhập
          </Button>
        </div>
      </Form>
    </Container>
  );
}
