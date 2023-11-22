import React, { useState, useEffect } from "react";
import axios from "axios";

function UserPostList({ profileUser, isProfileUser, changedDateInfo }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

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
        setPosts(response.data.posts);
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
                onChange={(e) => handleCheckboxChange(index)}
              />
            </label>
          ) : (
            <div className="userPostIndex">{index + 5 * (currentPage - 1)}</div>
          )}
          <div className="userPostListTitle">{post.title}</div>
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
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className="profilePageBtn"
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
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

export default UserPostList;