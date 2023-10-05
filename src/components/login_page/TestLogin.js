import React, { useState } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';

import TestDM from "../dm_page/TestDM";
import './TestLogin.css';

function Login({ socket }) {
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
            const isExists = response.data.exists;
            
            // exists 값에 따라 로그인 상태를 설정
            setIsLogin(isExists);

            // 로그인에 성공했을 경우 소캣으로 해당 아이디 전송
            if(isExists) {
                socketIO.emit("login", id);
            }
        }

        isEixist().then();
    };

    return (
        <div>
            {isLogin ? (
                <TestDM loginID={id} socket={socket}/>) : 
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