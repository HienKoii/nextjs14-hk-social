"use client";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams } from "next/navigation";
import { useUser } from "./UserContext";

const ProfileContext = createContext();
export default function ProfileProvider({ children }) {
  const token = Cookies.get("token");
  const { userID } = useParams();
  const { fetchUserData } = useUser();

  const [loading, setLoading] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [dataPostsUser, setDataPostsUser] = useState(null);

 
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/profile/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      console.log(`Lấy thông tin cá nhân user ID ${userID}`, response.data);
      setDataUser(response.data.user);
      setDataPostsUser(response.data.posts);
    } catch (error) {
      console.log("error fetchUserProfile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpload = async (uploadType, selectedFile, userId) => {
    setLoading(true);
    const formData = new FormData();
    formData.append(`${uploadType}`, selectedFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post(`/api/user/imgs/upload/${uploadType}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        fetchUserData();
      }
      // console.log("handleSubmitUpload", response);
    } catch (error) {
      console.error(`Lỗi khi cập nhật ${uploadType}`);
    } finally {
      setLoading(false);
    }
  };

  const values = { fetchUserProfile, loading, dataUser, dataPostsUser, handleSubmitUpload, setDataPostsUser };
  return <ProfileContext.Provider value={values}>{children}</ProfileContext.Provider>;
}
export const useProfile = () => {
  return useContext(ProfileContext);
};
