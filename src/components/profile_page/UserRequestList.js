import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function UserRequestList({ profileUser, isProfileUser, changedDateInfo }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  const pageButtonSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_REQUEST_API_URL}/getFinishedRequest`,
          {
            params: {
              id: profileUser,
              page: currentPage
            },
          }
        );

        const postList = await Promise
          .all(response.data.requests.map(async (request) => {
            const response = await axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getFinReqPostList`, {
              params: {
                pk: request.postPk
              }
            });

            return {
              ...request,
              pk: response.data._id,
              title: response.data.Title,
              nickname: response.data.Register_Nickname,
              date: response.data.Register_Date
            }
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
  };

  return (
    <div className="makerPostBox">
      <div className="finReqText">완료 의뢰 목록</div>
      {posts.map((post, index) => (
        <div className="finReqList" key={index}>
          <label className="finReqCheckboxDiv">
            <strong>[게시자]</strong>
            <br />
            {post.nickname}
          </label>
          <div className="finReqListTitle" onClick={() => navigate('/board/read?_id='+post.pk)}>
            {post.title}
          </div>
          <div className="finReqListDate">{changedDateInfo(post.date)}</div>
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
export default UserRequestList;