import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./NewPostList.css"

function NewPostList() {
    const [posts, setPosts] = useState([{
        Category: "category",
        Title: "Title",
        Author: "Author",
        Register_Date: new Date()
    }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="new-post-list">
            <div className="category-select-container">
                <label>카테고리: </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">전체</option>
                    <option value="글">글</option>
                    <option value="그림">그림</option>
                    <option value="코딩">코딩</option>
                    {/* 추가적인 카테고리 옵션들을 필요에 따라 추가할 수 있습니다 */}
                </select>
            </div>
            <thead>
                <tr>
                    <th className="index-header">Index</th>
                    <th className="category-header">Category</th>
                    <th className="title-header">Title</th>
                    <th className="author-header">Author</th>
                    <th className="date-header">Date</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => (
                    <tr key={index}>
                        <td className="index">{index + 1}</td>
                        <td className="category">{post.Category}</td>
                        <td className="title">{post.Title}</td>
                        <td className="author">{post.Author}</td>
                        <td className="date">{setDateInfo(post.Register_Date)}</td>
                    </tr>
                ))}
            </tbody>
            <div className="pagination-container">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-button"
                >
                    이전 페이지
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageClick(index + 1)}
                        className="page-button"
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-button"
                >
                    다음 페이지
                </button>
            </div>
            <div className="search-container">
                <label>검색: </label>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="write-button-container">
                <button onClick={() => console.log('Write button clicked')} className="write-button">
                    글쓰기
                </button>
            </div>
        </div>
    );
}

const setDateInfo = ({ date }) => {
    const nowDate = new Date();

    // 날짜를 비교하여 "시-분" 또는 "년-월-일"로 변환
    const formattedDate = nowDate.toDateString() === new Date(date).toDateString()
        ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        : new Date(date).toLocaleDateString();

    return formattedDate;
}

export default NewPostList;