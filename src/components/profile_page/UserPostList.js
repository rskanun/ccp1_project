import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function UserPostList({ profileUser, isProfileUser, changedDateInfo }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const pageButtonSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BOARD_API_URL}/getUserPostList`,
          {
            params: {
              id: profileUser,
              page: currentPage,
            },
          }
        );

        const postList = await Promise
          .all(response.data.posts.map(async (post) => {
            const response = await axios.get(`${process.env.REACT_APP_REQUEST_API_URL}/getRequest`, {
              params: {
                postID: post.pk
              }
            });

            return {
              ...post, status: response.data.Status
            };
          }))

        setPosts(postList);
        setTotalPages(response.data.totalPages);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [profileUser, currentPage]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems({});
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = { ...prevCheckedItems };
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  const handleDeleteClick = async () => {
    // 선택된 체크박스 확인
    const selectedPosts = posts.filter((_, index) => checkedItems[index]);

    if (selectedPosts.length === 0) {
      alert("삭제할 게시글을 선택하세요.");
      return;
    }

    // 서버로 선택된 항목 삭제 요청
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BOARD_API_URL}/deletePosts`, {
        params: { selectedPosts }
      });

      if (response.status === 200) {
        alert("게시판 삭제가 완료되었습니다.");

        // 삭제 후 데이터 다시 가져오기
        window.location.reload();
      }
    } catch (error) {
      // 에러 처리
      console.error(error);
    }
  };

  return (
    <div className="userPostBox">
      <div className="userPostText">
        게시글
        {isProfileUser &&
          <button className="userPostDeleteBtn" onClick={handleDeleteClick}>
            delete
          </button>}
      </div>
      {posts.map((post, index) => (
        <div className="userPostList" key={index}>
          {isProfileUser ? (
            <label className="userPostCheckboxDiv">
              <input
                type="checkbox"
                className="userPostCheckbox"
                checked={checkedItems[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
            </label>
          ) : (
            <div className="userPostIndex">{index + 5 * (currentPage - 1)}</div>
          )}
          <div className="userPostListTitle" onClick={() => navigate('/board/read?_id=' + post.pk)}>
            {
              (post.status && post.status !== '') &&
              <span style={{ color: getStatusColor(post.status) }}>
                [{post.status}]
              </span>
            } {post.title}
          </div>
          <div className="userPostListDate">{changedDateInfo(post.date)}</div>
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
        {Array.from({ length: Math.min(totalPages - parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize, pageButtonSize) }, (_, index) => {
          const firstPage = parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize + 1;
          const pageNumber = firstPage + index;

          return (
            <button
              key={pageNumber}
              className="profilePageBtn numberBtn"
              disabled={currentPage === pageNumber}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className="profilePageBtn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || posts.length <= 0}
        >
          〉
        </button>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case '모집 중':
      return 'rgb(255, 75, 75)';
    case '모집 완료':
      return 'rgb(260, 190, 40)';
    case '의뢰 완료':
      return 'rgb(190, 190, 190)';
  }
}

export default UserPostList;