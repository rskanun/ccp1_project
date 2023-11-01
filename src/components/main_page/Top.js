import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import "./Top.css";

import logo from "./img/outsourcing.jpg"

function Top() {
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);

    const handleLogout = () => {
        // 쿠키 삭제
        removeCookie('loginID', { path: '/' });
    };

    return(
        <div className="top">
            <a href="/board/list">
                <img src={logo} alt="Logo" />
            </a>
            {cookies.loginID ? (
                <a href="/login" className='menu' onClick={handleLogout}>로그아웃</a>
            ) : (
                <a href="/login" className='menu'>로그인</a>
            )}
            <a className='menu'>마이페이지</a>
            <a className='menu'>유저 검색</a>
            {cookies.loginID ? (
                <a href='/DM' className='menu'>DM</a>
            ) : 
                null
            }
            <hr></hr>
        </div>
    );
}
export default Top;