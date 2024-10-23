"use client";
import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4 text-center">Quên mật khẩu</h3>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Nhập email của bạn</Form.Label>
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading && <Spinner animation="border" variant="light" size="sm" />} Gửi liên kết đặt lại mật khẩu
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
