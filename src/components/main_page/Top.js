import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import "./Top.css";

import logo from "./img/outsourcing.jpg"

function Top() {
    const [id, setID] = useState('');
    const [cookies, removeCookie] = useCookies(['loginID']);

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                setID(res.data.id);
            } catch (e) {
                setID('');
            }
        }

        userCheck();
    }, [cookies.loginID]);

    const handleLogout = () => {
        // 쿠키 삭제
        removeCookie('loginID');
        // id를 빈 문자열로 설정
        setID('');
    };

    return(
        <div className="top">
            <a href="/board/list">
                <img src={logo} alt="Logo" />
            </a>
            {id ? (
                <a href="/login" className='menu' onClick={handleLogout}>로그아웃</a>
            ) : (
                <a href="/login" className='menu'>로그인</a>
            )}
            <a className='menu'>마이페이지</a>
            <a className='menu'>유저 검색</a>
            {id ? (
                <a href='/DM' className='menu'>DM</a>
            ) : 
                null
            }
            <hr></hr>
        </div>
    );
}
export default Top;