import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import UserMypage from "./UserMypage";
import ManagerMypage from "./ManagerMypage";

function MyPage() {
    const [userInfo, setUserInfo] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                const id = res.data.id;

                getUserInfo(id);
            } catch (e) {
                removeCookie('loginID', { path: '/' }); // 쿠키 삭제
                navigate('/login'); // 로그인 페이지 이동
            }
        }

        // 유저 정보 가져오기
        const getUserInfo = async (id) => {
            const userInfo = await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserInfo`, {
                params: {
                    id
                }
            });
            setUserInfo({
                id,
                password: userInfo.data.Password,
                nickname: userInfo.data.Nickname,
                email: userInfo.data.Email,
                isAdmin: (userInfo.data.Permission_Level >= 2)
            });
        }
        userCheck();
    }, [cookies.loginID]);

    return userInfo ? (
        userInfo.isAdmin ? <ManagerMypage user={userInfo}/> 
            : <UserMypage user={userInfo}/>
    ) : null;
}
export default MyPage;