import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./ProfilePage.css";

import UserProfile from "./UserProfile";
import UserPostList from "./UserPostList";
import UserRequestList from "./UserRequestList";

const urlParams = new URLSearchParams(window.location.search);

function UserProfilePage() {
  const [isProfileUser, setIsProfileUser] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const [finRequests, setFinRequests] = useState([]);
  const [creativeImages, setCreativeImages] = useState([]);
  const [cookies] = useCookies(["loginID"]);

  useEffect(() => {
    // 로그인 체크
    const userCheck = async () => {
      const token = cookies.loginID;
      const profileUser = urlParams.get("user");
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
          { token: token }
        );
        const id = res.data.id;

        setIsProfileUser(id === profileUser);
      } catch (e) {
        setIsProfileUser(false);
      } finally {
        setProfileInfo((prevProfileInfo) => ({
          ...prevProfileInfo,
          id: profileUser,
        }));
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
      <div className="firstPaper">
        <div className="secondPaper">
          <div className="contentPaper">
            <span className="profileTitle">
              <strong>Profile</strong>
            </span>
            <UserProfile
              profileInfo={profileInfo}
              isProfileUser={isProfileUser}
            />
            <UserPostList
              profileUser={profileInfo.id}
              isProfileUser={isProfileUser}
              changedDateInfo={changedDateInfo}
            />
            <UserRequestList
              requests={finRequests}
              changedDateInfo={changedDateInfo}
            />
            <PostingImageList postingImages={creativeImages} />
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function PostingImageList({ postingImages }) {
  const ImagesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPostingImage = currentPage * ImagesPerPage;
  const indexOfFirstPostingImage = indexOfLastPostingImage - ImagesPerPage;
  const currentImages = postingImages.slice(
    indexOfFirstPostingImage,
    indexOfLastPostingImage
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(postingImages.length / ImagesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className={`userImgBox${!postingImages || postingImages.length === 0 ? " nullImages" : ""
        }`}
    >
      <div className="userImgText">
        등록 이미지 목록
        <button className="userImgDeleteBtn">add</button>
      </div>
      {currentImages.map((postingImage, index) => (
        <div className="userImgList" key={index}>
          <div className="userImgInProfile">{postingImage.img}</div>
          <div className="userImgCat">#{postingImage.category}</div>
        </div>
      ))}

      {/* 게시글이 없는 경우 */}
      {(!postingImages || postingImages.length === 0) && (
        <p className="nullPost">아직 작성된 이미지가 없습니다!</p>
      )}

      <div className="btnListDiv">
        <button
          className="profilePageBtn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          〈
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className="profilePageBtn"
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="profilePageBtn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={
            currentPage === pageNumbers.length || postingImages.length <= 0
          }
        >
          〉
        </button>
      </div>
    </div>
  );
}

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
