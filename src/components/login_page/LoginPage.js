import React, { useState } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [cookies, setCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (id && password) {
            try {
                const loginResponse = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/login`, {
                    id: id,
                    pw: password,
                });

                const banResponse = await axios.get(`${process.env.REACT_APP_REPORT_API_URL}/getBanReport`, {
                    params: { userID: id },
                });

                if(banResponse.data === null || new Date(banResponse.data.Duration) <= new Date()) {
                    // 로그인에 성공했을 경우 쿠키에 사용자 정보를 json 형태로 저장
                    setCookie('loginID', loginResponse.data.token, { path: '/' });

                    // 소캣으로 해당 아이디 전송
                    socketIO.emit('login', id);

                    // 이전 페이지 이동
                    navigate(-1);
                } else {
                    setAlert(
                        <div>
                          해당 유저는 다음과 같은 사유로 활동 정지된 상태입니다<br />
                          사유: {banResponse.data.Reason}<br />
                          활동 정지 기간: {dateToStr(banResponse.data.Duration)} 까지
                        </div>
                      );
                }
            } catch (error) {
                setAlert('입력하신 정보와 일치하는 계정이 없습니다.');
            }
        } else {
            setAlert('아이디와 비밀번호를 모두 입력해주시길 바랍니다.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    const openJoinWindow = () => {
        navigate('/register/admitCheck');
    };

    const openFindAccWindow = () => {
        const newWindowUrl = './login/findAcc'; //아이디 또는 비번 찾기 페이지
        window.open(newWindowUrl, '_blank', 'width=450, height=350');
    };

    return (
        <div className="whole_login_box">
            <div className="small_login_box">
                <h3><strong>로그인</strong></h3>
                <input type="text" className="input_info" name="id" placeholder="아이디" value={id} onChange={
                    (e) => setID(e.target.value)
                } onKeyDown={handleKeyDown} /><br />
                <input type="password" className="input_info" name="password" placeholder="비밀번호" value={password} onChange={
                    (e) => setPassword(e.target.value)
                } onKeyDown={handleKeyDown} /><br /><br />
                {alert && <span id="warningText" className='warning'>{alert}</span>}
                {alert && <br />}
                <button className="login_check" onClick={handleLogin}>로그인</button><br />
                <span className="create_acc" onClick={openJoinWindow}>회원가입</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="find_acc" onClick={openFindAccWindow}>아이디&nbsp;/&nbsp;비밀번호 찾기&nbsp;</span>
            </div>
        </div>
    );
}

const dateToStr = (date) => {
    const formattedDate = new Date(date).toLocaleDateString()
        + " "
        + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

    return formattedDate;
}

export default LoginPage;