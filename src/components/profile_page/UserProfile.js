import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import "./ProfilePage.css";

function UserProfile() {
    const [profileInfo, setProfileInfo] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                const id = res.data.id;

                setProfileInfo({id});
                getUserInfo(id);
            } catch (e) {
                removeCookie('loginID', { path: '/' }); // 쿠키 삭제
                navigate('/login'); // 로그인 페이지 이동
            }
        }

        // 유저 닉네임 가져오기
        const getUserInfo = async (id) => {
            const userInfo = await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserInfo`, {
                params: {
                    id
                }
            });
            setProfileInfo({
                nickname: userInfo.data.Nickname
            });
        }
        userCheck();
    }, [cookies.loginID]);

    return (
        profileInfo ? (
            <div className="wholeUserProfliePage">
            <div className="firstPaper">
                <div className="secondPaper">
                    <div className="contentPaper">
                        <span className="profileTitle"><strong>Profile</strong></span>
                        <Profile nickname={profileInfo.nickname} introduction="소개"/>
                        <PostList posts={[]} />
                        <RequestList requests={[]} />
                        <PostingImageList postingImages={[]} />
                    </div>
                </div>
            </div>
        </div>
        ) : null
    );
}

function Profile({nickname, introduction}) {
    return (
        <div className="userProfileBox">
            <div className="profliePic">
                <button className="putPic">-</button>
            </div>
            <div className="proflieIntro">
                <div className="userNameBox">
                    <span className="nameText">Name</span>
                    <div className="userNameText">{nickname}</div>

                </div>
                <button className="DMWithUserBtn">DM+</button>
                <div className="userIntroBox">
                    <span className="introText">[자기소개]</span><button className="writeInterBtn">+</button>
                    <div className="userIntroText">{introduction}</div>

                </div>
            </div>
        </div>
    )
}

function PostList({ posts }) {
    const postsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="userPostBox">
            <div className="userPostText">
                게시글
                <button className="userPostDeleteBtn">delete</button>
            </div>
            {currentPosts.map((post, index) => (
                <div className="userPostList" key={index}>
                    <label className="userPostCheckboxDiv">
                        <input type="checkbox" className="userPostCheckbox" />
                    </label>
                    <div className="userPostListTitle">
                        {post.title}
                    </div>
                    <div className="userPostListDate">
                        {changedDateInfo(post.date)}
                    </div>
                </div>
            ))}

            {/* 게시글이 없는 경우 */}
            {(!posts || posts.length === 0) && (
                <p className="nullPost">아직 게시글이 없습니다!</p>
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
                    disabled={currentPage === pageNumbers.length || posts.length <= 0}
                >
                    〉
                </button>
            </div>
        </div>
    );
}

function RequestList({ requests }) {
    const RequestsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastRequest = currentPage * RequestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - RequestsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(requests.length / RequestsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="makerPostBox">
            <div className="finReqText">
                완료 의뢰 목록
            </div>
            {currentRequests.map((request, index) => (
                <div className="finReqList" key={index}>
                    <label className="finReqCheckboxDiv">
                        <strong>[게시자]</strong><br />
                        {request.nickname}
                    </label>
                    <div className="finReqListTitle">
                        {request.title}
                    </div>
                    <div className="finReqListDate">
                        {changedDateInfo(request.date)}
                    </div>
                </div>
            ))}

            {/* 게시글이 없는 경우 */}
            {(!requests || requests.length === 0) && (
                <p className="nullPost">아직 게시글이 없습니다!</p>
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
                    disabled={currentPage === pageNumbers.length || requests.length <= 0}
                >
                    〉
                </button>
            </div>
        </div>
    );
}

function PostingImageList({ postingImages }) {
    const ImagesPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPostingImage = currentPage * ImagesPerPage;
    const indexOfFirstPostingImage = indexOfLastPostingImage - ImagesPerPage;
    const currentImages = postingImages.slice(indexOfFirstPostingImage, indexOfLastPostingImage);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(postingImages.length / ImagesPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={`userImgBox${(!postingImages || postingImages.length === 0) ? ' nullImages' : ''}`}>
            <div className="userImgText">
                등록 이미지 목록
                <button className="userImgDeleteBtn">delete</button>
            </div>
            {currentImages.map((postingImage, index) => (
                <div className="userImgList" key={index}>
                    <div className="userImgInProfile">
                        {postingImage.img}
                    </div>
                    <div className="userImgCat">
                        #{postingImage.category}
                    </div>
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
                    disabled={currentPage === pageNumbers.length || postingImages.length <= 0}
                >
                    〉
                </button>
            </div>
        </div>
    )
}

const changedDateInfo = ({ date }) => {
    const nowDate = new Date();

    // 날짜를 비교하여 "시-분" 또는 "년-월-일"로 변환
    const formattedDate = nowDate.toDateString() === new Date(date).toDateString()
        ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        : new Date(date).toLocaleDateString();

    return formattedDate;
}

export default UserProfile;