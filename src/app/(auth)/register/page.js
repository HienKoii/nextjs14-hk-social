"use client";

import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Link from "next/link";

import { validateInput } from "@/src/utils";

function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "", // Thêm giới tính
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    const maxLength = 20;

    // Kiểm tra username
    if (!validateInput(formData.username)) {
      return alert("Tài khoản chỉ được chứa các ký tự thường không dấu");
    }
    if (formData.username.length > maxLength) {
      return alert("Tài khoản không được vượt quá 20 ký tự");
    }

    // Kiểm tra password
    if (!validateInput(formData.password)) {
      return alert("Mật khẩu chỉ được chứa các ký tự thường không dấu");
    }
    if (formData.password.length > maxLength) {
      return alert("Mật khẩu không được vượt quá 20 ký tự");
    }

    if (formData.fullName.length > maxLength) {
      return alert("Họ tên không được vượt quá 20 ký tự");
    }

    // Kiểm tra mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      return alert("Hai mật khẩu không trùng");
    }

    // Kiểm tra giới tính
    if (!formData.gender) {
      return alert("Vui lòng chọn giới tính");
    }

    setLoading(true);
    try {
      const { username, email, password, fullName, gender } = formData;
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        fullName,
        gender, // Gửi thêm giới tính
      });
      setSuccess(response.data.message);
      setError(null);
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "", // Thêm giới tính
      });
    } catch (err) {
      setError(err.response?.data.message || "Đăng ký không thành công");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4 p-3">
      <h2 className="text-center">Đăng Ký</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Username */}
        <Form.Group controlId="formUsername">
          <Form.Control type="text" name="username" placeholder="Tên người dùng" value={formData.username} onChange={handleInputChange} required autoComplete="username" />
          <Form.Text className="text-muted">Tài khoản chỉ được chứa các ký tự thường (a-z) và số , không dấu và không quá 20 ký tự.</Form.Text>
        </Form.Group>

        {/* Full Name */}
        <Form.Group controlId="formFullName" className="mt-3">
          <Form.Control type="text" name="fullName" placeholder="Họ & tên" value={formData.fullName} onChange={handleInputChange} required autoComplete="fullName" />
          <Form.Text className="text-muted">Họ & tên không được vượt quá 20 ký tự.</Form.Text>
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Control type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleInputChange} required autoComplete="email" />
          <Form.Text className="text-muted">Email không được vượt quá 20 ký tự.</Form.Text>
        </Form.Group>

        {/* Password */}
        <Form.Group controlId="formPassword1" className="mt-3">
          <Form.Control type="password" name="password" placeholder="Nhập mật khẩu" value={formData.password} onChange={handleInputChange} required autoComplete="current-password1" />
          <Form.Text className="text-muted">Mật khẩu chỉ được chứa các ký tự thường (a-z) và số, không dấu và không quá 20 ký tự.</Form.Text>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group controlId="formPassword2" className="mt-3">
          <Form.Control type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleInputChange} required autoComplete="current-password2" />
          <Form.Text className="text-muted">Vui lòng nhập lại mật khẩu đã nhập ở trên.</Form.Text>
        </Form.Group>

        {/* Gender */}
        <Form.Group controlId="formGender" className="mt-3">
          <Form.Label>Giới tính:</Form.Label>
          <div>
            <Form.Check inline label="Nam" name="gender" type="radio" id="genderMale" value="Nam" checked={formData.gender === "Nam"} onChange={handleInputChange} />
            <Form.Check inline label="Nữ" name="gender" type="radio" id="genderFemale" value="Nữ" checked={formData.gender === "Nữ"} onChange={handleInputChange} />
          </div>
        </Form.Group>

        <div className="w-100 mt-3 d-flex justify-content-center align-items-center">
          <span>Bạn đã có tài khoản!</span>
          <Button as={Link} href={"/login"} variant="link" className="ps-1">
            Đăng nhập ngay ?
          </Button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
            {loading && <Spinner animation="border" variant="light" size="sm" />} Đăng Ký
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default RegisterForm;
