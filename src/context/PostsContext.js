"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useProfile } from "./ProfileContext";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const pathname = usePathname();
  const isProfilePage = /^\/profile\/\w+$/.test(pathname);
  const token = Cookies.get("token");

  const { setDataPostsUser } = useProfile();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [offset, setOffset] = useState(0); // Vị trí bắt đầu
  const [hasMore, setHasMore] = useState(true);
  const limit = 3; // Số lượng item mỗi lần gọi API

  const fetchPosts = async (newOffset) => {
    setLoading(true); // Bắt đầu tải
    try {
      let api;

      if (token) {
        api = await axios.get(`/api/posts/token?limit=${limit}&offset=${newOffset || 0}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        api = await axios.get(`/api/posts/public?limit=${limit}&offset=${newOffset || 0}`);
      }
      const response = api;
      // console.log("response.data.posts", response.data.posts);
      if (!response.data.posts) return;
      setPosts((prevData) => {
        const newData = response.data.posts.filter((newPost) => !prevData.some((existingPost) => existingPost.id === newPost.id));

        return [...prevData, ...newData];
      });
      if (response.data.posts.length < limit) {
        setHasMore(false); // Không còn dữ liệu mới để tải
      } else {
        setHasMore(true); // Có dữ liệu mới để tải
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Xử lý lỗi
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  const handleScroll = () => {
    // Kiểm tra nếu đang loading hoặc không còn dữ liệu để tải
    if (loading || !hasMore) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      setOffset((prevOffset) => {
        const newOffset = prevOffset + limit;
        fetchPosts(newOffset);
        return newOffset;
      });
    }
  };

  const handleCreatePots = async (formData) => {
    try {
      const response = await axios.post("/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo rằng Content-Type được thiết lập đúng
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      if (response.status == 201) {
        setOffset(0);
        setPosts([]);
        fetchPosts(0);
      }
      return response;
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error.response?.data || error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (!token) return;
      const response = await axios.delete(`/api/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      console.log("Xử lý xóa bài viết: ", response);

      if (response.status == 200) {
        setOffset(0);
        setPosts([]);
        fetchPosts(0);
      }
      return response;
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };

  const handleUpdatePost = async (postId, content, status) => {
    try {
      const response = await axios.put(
        `/api/posts/update/${postId}`,
        { content, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        // // Cập nhật lại danh sách bài viết
        if (isProfilePage) {
          setDataPostsUser((prevPosts) => prevPosts.map((prev) => (prev.id === postId ? { ...prev, content, status, updated_at: new Date().toISOString() } : prev)));
          setOffset(0);
          setPosts([]);
          fetchPosts(0);
        } else {
          setPosts((prevPosts) => prevPosts.map((prev) => (prev.id === postId ? { ...prev, content, status, updated_at: new Date().toISOString() } : prev)));
        }
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    // Thêm sự kiện cuộn
    window.addEventListener("scroll", handleScroll);

    // Gọi API ban đầu khi component được mount
    if (hasMore) {
      fetchPosts(offset);
    }

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, token, hasMore, setDataPostsUser]); // Thêm `hasMore` vào dependencies

  const values = { loading, posts, offset, fetchPosts, handleCreatePots, handleDeletePost, handleUpdatePost };
  return <PostsContext.Provider value={values}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
  return useContext(PostsContext);
};
