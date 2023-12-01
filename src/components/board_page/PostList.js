import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./PostList.css"

const urlParams = new URLSearchParams(window.location.search);
const categories = ["all", "draw", "program", "music", "goods", "video", "other"];

function PostList() {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const getCategory = urlParams.get('category');
    const getSearch = decodeURIComponent(urlParams.get('search'));
    const currentPage = parseInt(urlParams.get('page')) || 1;

    const pageButtonSize = 5;

    // 게시판 목록 가져오기
    useEffect(() => {
        const loadBoardList = async () => {
            try {
                const postsData = await axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getPostList`, {
                    params: {
                        type: getCategory,
                        search: getSearch,
                        page: currentPage
                    }
                });

                const postList = await Promise
                    .all(postsData.data.posts.map(async (post) => {
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
                setTotalPages(postsData.data.totalPages)
                
                const category = categories.includes(getCategory) ? getCategory : 'all';
                setCategory(category);
                setSelectedCategory(category);
            } catch (e) {
                if(e.response.status === 404) {
                    const category = categories.includes(getCategory) ? getCategory : 'all';

                    setCategory(category);
                    setSelectedCategory(category);
                }
                else {
                    setCategory('all');
                    setSelectedCategory('all');
    
                    console.error(e);
                }
            }
        }

        loadBoardList();
        console.log(category);
    }, [setCategory]);

    const handlePageClick = (pageNumber) => {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.set('page', pageNumber);

        window.location.href = currentUrl.toString();
    };

    const handleCategoryClick = (category) => {
        window.location.href = '/board/list?category=' + category;
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchText !== '') {
            const encodedSearch = encodeURIComponent(searchText);
            window.location.href = '/board/list?search=' + encodedSearch;

            setSearchText('');
        }
    }

    const handlePostClick = (id) => {
        window.location.href = '/board/read?_id='+id;
    }

    return (
        <div className="new-post-list">
            <div className="category-buttons-container">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            <div className='top-banner-container'>
                <div className='category-text'>
                    <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder='Search'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearch}
                        className="search-input"
                    />
                </div>
            </div>
            <div className='posts-container'>
                {posts.map((post, index) => (
                    <div key={index}  className='post-container' onClick={() => handlePostClick(post.pk)}>
                        <div className="list-index">{index + 1}</div>
                        <div className='post-content-container'>
                            <div className='post-top-container'>
                                <div className='list-title'>{
                                    (post.status && post.status !== '') &&
                                        <span style={{ color: getStatusColor(post.status) }}>
                                            [{post.status}] 
                                        </span>
                                } {post.title}</div>
                                <div className="list-date">{setDateInfo(post.date)}</div>
                            </div>
                            <div className='post-bottom-container'>
                                <div className="list-author">{post.userNickname}</div>
                                <div className="list-category">#{(post.category !== "other") ? post.category : post.otherCategory}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="write-button-container">
                <button onClick={() => {window.location.href = '/board/write?category='+category}} className="write-button">
                    글쓰기
                </button>
            </div>
            <div className="pagination-container">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-button"
                >
                    〈
                </button>
                {Array.from({ length: Math.min(totalPages - parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize, pageButtonSize) }, (_, index) => {
                    const firstPage = parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize + 1;
                    const pageNumber = firstPage + index;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageClick(pageNumber)}
                            className='page-button'
                            disabled={pageNumber === currentPage}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-button"
                >
                    〉
                </button>
            </div>
        </div>
    );
}

const setDateInfo = (date) => {
    const nowDate = new Date();

    // 날짜를 비교하여 "시-분" 또는 "년-월-일"로 변환
    const formattedDate = nowDate.toDateString() === new Date(date).toDateString()
        ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        : new Date(date).toLocaleDateString();

    return formattedDate;
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

export default PostList;