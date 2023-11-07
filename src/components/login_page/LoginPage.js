import React, { useState } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// javaScript
import Top from "../main_page/Top";
import Bottom from "../main_page/Bottom";

import './LoginPage.css';

function LoginPage() {
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [cookies, setCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(id && password) {
            await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/login`, {
                id: id,
                pw: password
            })
            .then((res) => {
                // 로그인에 성공했을 경우 쿠키에 사용자 정보를 json 형태로 저장
                setCookie('loginID', res.data.token, { path: '/' });
    
                // 소캣으로 해당 아이디 전송
                socketIO.emit("login", id);
    
                // 메인 페이지 이동
                navigate('/');
            })
            .catch(() => {
                setAlert("입력하신 정보와 일치하는 계정이 없습니다.");
            })
        }
        else setAlert("아이디와 비밀번호를 모두 입력해주시길 바랍니다.");
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleLogin();
        }
    }

    const openJoinWindow = () => {
        const newWindowUrl = ''; //회원가입 페이지
        window.open(newWindowUrl, '_blank', 'width=400,height=300');
    };

    const openFindAccWindow = () => {
        const newWindowUrl = './login/FindAcc'; //아이디 또는 비번 찾기 페이지
        window.open(newWindowUrl, '_blank', 'width=450, height=350');
    };

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
                {alert && <span id="warningText" className='warning'>{alert}</span>}
                {alert && <br/>}
                <button className="login_check" onClick={handleLogin}>로그인</button><br />
                <span className="create_acc" onClick={openJoinWindow}>회원가입</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="find_acc" onClick={openFindAccWindow}>아이디&nbsp;/&nbsp;비밀번호 찾기&nbsp;</span>
            </div>
        </div>
    );
}
export default LoginPage;