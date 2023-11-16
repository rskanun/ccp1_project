import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import UserMypage from "./UserMypage";
import ManagerMypage from "./ManagerMypage";
import axios from "axios";

function MyPage() {
    const [isAdmin, setAdmin] = useState(false);
    const [id, setID] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                const id = res.data.id;

                setID(id);
                permissionCheck(id);
            } catch (e) {
                removeCookie('loginID', { path: '/' }); // 쿠키 삭제
                navigate('/login'); // 로그인 페이지 이동
            }
        }

        // 관리자 권한 체크
        const permissionCheck = async (id) => {
            try {
                const permissionLevel = await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserPermissionLevel`, {
                    params: {
                        id
                    }
                });
                setAdmin((permissionLevel >= 2) ? true : false);
            } catch(e) {
                console.log(e);
            }
        }

        userCheck();
    }, [cookies.loginID]);

    return id ? (
        isAdmin ? <ManagerMypage/> 
            : <UserMypage id={id}/>
    ) : null;
}
export default MyPage;