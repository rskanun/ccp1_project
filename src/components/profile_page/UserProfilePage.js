import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

import "./ProfilePage.css";

import UserProfile from "./UserProfile";
import UserPostList from "./UserPostList";
import UserRequestList from "./UserRequestList";
import UserCreativeImages from "./UserCreativeImages";

function UserProfilePage() {
  const [loginID, setLoginID] = useState('');
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isProfileUser, setIsProfileUser] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const [cookies] = useCookies(["loginID"]);

  useEffect(() => {
    // Params 가져오기
    const fetchParamsData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const profileUser = urlParams.get('user');
      setProfileInfo((prevProfileInfo) => ({
        ...prevProfileInfo,
        id: profileUser,
      }));

      return profileUser;
    };

    // 로그인 체크
    const userCheck = async () => {
      const token = cookies.loginID;
      const profileUser = await fetchParamsData();

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
          { token: token }
        );
        const id = res.data.id;

        setLoginID(id);
        setIsProfileUser(id === profileUser);
      } catch (e) {
        setIsProfileUser(false);
      } finally {
        getUserInfo(profileUser);
        getProfileInfo(profileUser);
      }
    };

    // 유저 닉네임 가져오기
    const getUserInfo = async (id) => {
      const userInfo = await axios.get(
        `${process.env.REACT_APP_USER_API_URL}/getUserInfo`,
        {
          params: {
            id,
          },
        }
      );
      setProfileInfo((prevProfileInfo) => ({
        ...prevProfileInfo,
        nickname: userInfo.data.Nickname,
      }));
    };

    // 프로필 정보 가져오기
    const getProfileInfo = async (id) => {
      const profile = await axios.get(
        `${process.env.REACT_APP_PROFILE_API_URL}/getUserProfile`,
        {
          params: {
            id,
          },
        }
      );
      setProfileInfo((prevProfileInfo) => ({
        ...prevProfileInfo,
        introduction: profile.data.Introduction,
      }));
    };

    userCheck();
  }, [cookies.loginID]);

  return profileInfo ? (
    <div className="wholeUserProfliePage">
      <ImageModal
        images={images}
        selectedImageIndex={selectedImageIndex}
        onClose={() => {
          setSelectedImageIndex(null);
          setIsModalOpen(false);
        }}
      />
      <div className="firstPaper">
        <div className="secondPaper">
          <div className="contentPaper">
            <span className="profileTitle">
              <strong>Profile</strong>
            </span>
            <UserProfile
              profileInfo={profileInfo}
              isProfileUser={isProfileUser}
              loginID={loginID}
            />
            <UserPostList
              profileUser={profileInfo.id}
              isProfileUser={isProfileUser}
              changedDateInfo={changedDateInfo}
            />
            <UserRequestList
              profileUser={profileInfo.id}
              isProfileUser={isProfileUser}
              changedDateInfo={changedDateInfo}
            />
            <UserCreativeImages
              profileUser={profileInfo.id}
              isProfileUser={isProfileUser}
              images={images}
              setImages={setImages}
              setIsModalOpen={setIsModalOpen}
              setSelectedImageIndex={setSelectedImageIndex}
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function ImageModal({ images, selectedImageIndex, onClose }) {
  if (selectedImageIndex === null || !images[selectedImageIndex]) {
    return null;
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content">
        <img src={selectedImage.img} alt={`Image ${selectedImageIndex}`} />
      </div>
    </div>
  );
};

const changedDateInfo = (date) => {
  const nowDate = new Date();

  // 날짜를 비교하여 "시-분" 또는 "년-월-일"로 변환
  const formattedDate =
    nowDate.toDateString() === new Date(date).toDateString()
      ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      : new Date(date).toLocaleDateString();

  return formattedDate;
};

export default UserProfilePage;
