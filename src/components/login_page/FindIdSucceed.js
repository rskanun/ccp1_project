import React, { useState } from 'react';
import './FindIdSucceed.css';


function NoticeIdSucceed() {
    const openLoginPage = () => {
        const login = 'http://outsourcing/loginPage/login'; 
        window.open(login, '_blank', 'width=400,height=300');
      };

    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticeID">
                <span style={{ fontWeight: 'bold' }}>찾은 아이디</span>
            </div>
            <br/>
            <div className="noticeIDText">
                <span>매칭되는 아이디를 찾았습니다!</span>
            </div>
            <br/>
            <div className="buttonBox">
                <button className="goToLogin" onClick={openLoginPage}>
                 로그인창으로 이동
                </button>
            </div>
        </div>
    )
}

export default NoticeIdSucceed;