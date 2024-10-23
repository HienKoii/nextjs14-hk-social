import React, { useState, useEffect, useCallback } from "react";
import { Form, Card, ListGroup, Spinner, Alert, Image } from "react-bootstrap";
import { FaCircle, FaSearch } from "react-icons/fa";
import axios from "axios";
import debounce from "lodash.debounce";
import Link from "next/link";
import ImagesAvatar from "../Images/ImagesAvatar";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(""); // Lỗi (nếu có)

  // Hàm thực hiện tìm kiếm gọi API
  const searchUsersAndPosts = async (searchTerm) => {
    if (!searchTerm) return; // Nếu không có từ khóa, không gọi API

    setLoading(true); // Bật trạng thái loading
    try {
      const response = await axios.get(`/api/search?search=${searchTerm}`);
      setSearchResults(response.data.results); // Cập nhật kết quả tìm kiếm
      console.log("Kết quả tìm kiếm: ", response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi");
      setSearchResults([]);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Sử dụng debounce để chỉ gọi API sau khi người dùng dừng gõ một khoảng thời gian nhất định
  const debouncedSearch = useCallback(debounce(searchUsersAndPosts, 300), []);

  // Hàm xử lý khi thay đổi input tìm kiếm
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Cập nhật từ khóa tìm kiếm

    if (value === "") {
      setSearchResults([]); // Nếu input rỗng, đặt kết quả tìm kiếm thành mảng rỗng
    } else {
      debouncedSearch(value); // Nếu có từ khóa, gọi hàm debounce để tìm kiếm
    }
  };

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center position-relative">
      {/* Ô input tìm kiếm */}
      <Form.Control
        type="search"
        placeholder="Tìm kiếm..."
        aria-label="Search"
        className="ms-2"
        style={{ borderRadius: "22px" }}
        value={searchTerm}
        onChange={handleInputChange} // Gọi khi người dùng thay đổi input
        onInput={handleInputChange} // Sử dụng cả onInput để nhận sự kiện xóa qua dấu X
      />
      {/* 
      <div className="d-block d-lg-none h-100 bg-light ms-1" style={{ borderRadius: "99999px", cursor: "pointer" }}>
        <div style={{ width: "40px", height: "40px" }} className="d-flex justify-content-center align-items-center">
          <FaSearch />
        </div>
      </div> */}

      {/* Hiển thị kết quả tìm kiếm */}
      {searchTerm && (
        <div className="position-absolute" style={{ top: "44px", zIndex: 99999999, width: "100%" }}>
          <Card>
            <div className="text-center fw-bold py-2">Kết quả tìm kiếm</div>
            <ListGroup variant="flush" className="hk-scrollbar" style={{ maxHeight: "300px", overflowX: "hidden" }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-2">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <ListGroup.Item key={index} className="p-3">
                        <div className="d-flex justify-content-start align-items-center">
                          <Link href={`/profile/${result.userId}`} className="position-relative">
                            <ImagesAvatar id={result.userId} url={result.avatar} isCircle className={"object-fit-cover"} />
                          </Link>
                          <div className="ms-1">
                            <Link href={`/profile/${result.userId}`} className="d-flex justify-content-start align-items-center gap-1">
                              <div className="w-100 d-flex flex-column">
                                <span className="fw-bold"> {result.fullName} </span>
                              </div>
                              {result.tick ? (
                                <Image
                                  src={`/images/tick.png`} //
                                  alt="Avatar"
                                  width={15}
                                  className="rounded-circle"
                                />
                              ) : null}
                            </Link>
                          </div>
                        </div>
                        {result.content && (
                          <div>
                            <strong>Nội dung bài viết:</strong>
                            <p className="limited-text">{result.content}</p>
                          </div>
                        )}
                      </ListGroup.Item>
                    ))
                  ) : (
                    <>
                      <Alert variant="info" className="text-center">
                        Không tìm thấy kết quả phù hợp.
                      </Alert>
                    </>
                  )}
                </>
              )}
            </ListGroup>
          </Card>
        </div>
      )}
    </div>
  );
}
