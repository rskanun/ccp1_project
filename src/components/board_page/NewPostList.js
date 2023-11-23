import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./NewPostList.css"

const categories = ["All", "Draw", "Program", "Music", "Goods", "Video", "Other"];

function NewPostList() {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

        // 게시판 목록 가져오기
        useEffect(() => {
            const loadBoardList = async () => {
                const urlParams = new URLSearchParams(window.location.search);
                const getCategory = urlParams.get('category');
                const getSearch = decodeURIComponent(urlParams.get('search'));
    
                const list = await axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getPostList`, {
                    params: {
                        type: getCategory,
                        search: getSearch
                    }
                });
                console.log(list.data);
                const categoryName = getCategory.charAt(0).toUpperCase() + getCategory.slice(1);
    
                setPosts(list.data);
                setCategory(categories.includes(categoryName) ? categoryName : 'All');
            }
    
            loadBoardList().then();
        }, [setCategory]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="new-post-list">
            <div className="category-buttons-container">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className='top-banner-container'>
                <div className='category-text'>
                    <p>{category}</p>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder='Search'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className='posts-container'>
                {posts.map((post, index) => (
                    <div className='post-container' key={index}>
                        <div className="index">{index + 1}</div>
                        <div className='post-content-container'>
                            <div className='post-top-container'>
                                <div className='title'>{post.Title}</div>
                                <div className="date">{setDateInfo(post.Register_Date)}</div>
                            </div>
                            <div className='post-bottom-container'>
                                <div className="author">{post.Author}</div>
                                <div className="category">#{post.Category}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="write-button-container">
                <button onClick={() => console.log('Write button clicked')} className="write-button">
                    글쓰기
                </button>
            </div>
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