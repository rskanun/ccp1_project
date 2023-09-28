import React, { useState } from 'react';
import axios from 'axios';

import TestDM from "../dm_page/TestDM";
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
            setIsLogin(response.data.exists);
        }

        isEixist().then();
    };

    return (
        <div>
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
                <a href=""><span className="find_acc">아이디 찾기</span></a>
                <a href=""><span className="find_acc">비밀번호 찾기</span></a>
                </div>)}
        </div>
    );
}

export default Login;