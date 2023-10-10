import React, { useState } from 'react';
import axios from 'axios';

import TestDM from "../dm_page/DM";
import './TestLogin.css';

function Login() {
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = () => {
        const isEixist = async () => {
            const response = await axios.get("http://localhost:4000/loginPage/api/IsAccountExists", {
                params: {
                    id: id,
                    pw: password
                }
            });
            
            // exists 값에 따라 로그인 상태를 설정
            if (!(response.data.exists)) console.log("아이디 또는 비밀번호가 일치하지 않습니다.");
            else setIsLogin(response.data.exists);
        }
        isEixist().then();
         
    };

    const openJoinWindow = () => {
        const newWindowUrl = ''; //회원가입 페이지
        window.open(newWindowUrl, '_blank', 'width=400,height=300');
    };

    const openFindAccWindow = () => {
        const newWindowUrl = './TestFindAcc.js'; //아이디 또는 비번 찾기 페이지
        window.open(newWindowUrl, '_blank', 'width=400,height=300');
    };

    return (
        <div className = "whole_box">
            {isLogin ? (
                <TestDM loginID={id}/>) : 
                (
                <div className="login_box">
                <h3>로그인</h3>
                <input type="text" className="input_info" name="id" placeholder="아이디" value={id} onChange={
                    (e) => setID(e.target.value)
                }/><br />
                <input type="password" className="input_info" name="password" placeholder="비밀번호" value={password} onChange={
                    (e) => setPassword(e.target.value)
                }/><br />
                <button className="login_check" onClick={handleLogin}>로그인</button><br />
                <a href=""><span className="create_acc" onClick={openJoinWindow}>회원가입</span></a>
                <a herf=""><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
                <a href=""><span className="find_acc" onClick={openFindAccWindow}>아이디&nbsp;/&nbsp;비밀번호 찾기&nbsp;</span></a>
                </div>)}
        </div>
    );
}

export default Login;