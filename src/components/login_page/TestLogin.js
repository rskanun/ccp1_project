import React from 'react';
import './TestLogin.css';

function Login() {
    return (
        <div className="login_box">
            <h3>로그인</h3>
            <input type="text" className="input_info" name="id" placeholder="아이디" /><br />
            <input type="password" className="input_info" name="password" placeholder="비밀번호" /><br />
            <button className="login_check">로그인</button><br />
            <a href=""><span className="find_acc">아이디 찾기</span></a>
            <a href=""><span className="find_acc">비밀번호 찾기</span></a>
        </div>
    );
}

export default Login;