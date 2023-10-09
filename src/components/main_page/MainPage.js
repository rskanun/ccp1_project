import React, { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        const userCheck = () => {
            const token = cookies.loginID;

            axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token})
                .then()
                .catch(() => {
                    handleLogout();
                })
        }

        userCheck();
    }, [cookies.loginID])

    const handleLogout = () => {
        removeCookie('loginID'); // 쿠키 삭제
        navigate('login'); // 로그인 페이지 이동
    }

    return (
        <div className="navbar">
            <h1>My App</h1>
            <div>
                <button onClick={() => navigate('DM')}>DM 페이지</button>
                <button onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
    );
}
export default MainPage;