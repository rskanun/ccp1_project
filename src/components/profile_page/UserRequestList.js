import React, { useState, useEffect } from "react";
import axios from "axios";

function UserRequestList({ requests, changedDateInfo }) {
    const RequestsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
  
    const indexOfLastRequest = currentPage * RequestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - RequestsPerPage;
    const currentRequests = requests.slice(
      indexOfFirstRequest,
      indexOfLastRequest
    );
  
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(requests.length / RequestsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    return (
      <div className="makerPostBox">
        <div className="finReqText">완료 의뢰 목록</div>
        {currentRequests.map((request, index) => (
          <div className="finReqList" key={index}>
            <label className="finReqCheckboxDiv">
              <strong>[게시자]</strong>
              <br />
              {request.nickname}
            </label>
            <div className="finReqListTitle">{request.title}</div>
            <div className="finReqListDate">{changedDateInfo(request.date)}</div>
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
  export default UserRequestList;