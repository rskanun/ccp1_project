import React, { useState } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    const handleLogin = async () => {
        await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/login`, {
            id: id,
            pw: password
        })
        .then((res) => {
            // 로그인에 성공했을 경우 쿠키에 사용자 정보를 json 형태로 저장
            setCookie('loginID', res.data.token);

            // 소캣으로 해당 아이디 전송
            socketIO.emit("login", id);

            // 메인 페이지 이동
            navigate('/');
        })
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className = "whole_box">
            <div className="login_box">
                <h3>로그인</h3>
                <input type="text" className="input_info" name="id" placeholder="아이디" value={id} onChange={
                    (e) => setID(e.target.value)
                } onKeyDown={handleKeyDown}/><br/>
                <input type="password" className="input_info" name="password" placeholder="비밀번호" value={password} onChange={
                    (e) => setPassword(e.target.value)
                } onKeyDown={handleKeyDown}/><br />
                <button className="login_check" onClick={handleLogin}>로그인</button><br />
                <a href="#" className="find_acc">회원가입</a>
                <a herf="#" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                <a href="#" className="find_acc">아이디&nbsp;/&nbsp;비밀번호 찾기&nbsp;</a>
            </div>
        </div>
    );
}
export default LoginPage;