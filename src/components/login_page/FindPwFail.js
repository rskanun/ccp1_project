import React, { useState } from 'react';
import './FindPwFail.css';


function NoticeIdFail() {
    const openLoginPage = () => {
        const login = 'http://outsourcing/loginPage/login'; 
        window.open(login, '_blank', 'width=400,height=300');
      };


    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticeFailText">
                <span style={{ fontWeight: 'bold' }}>매칭되는 비밀번호를 찾지 못했습니다.</span>
            </div>
            <br/>
            <div className="noticeFailText2">
                <span>일치하는 비밀번호가 없습니다.</span>
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

export default NoticeIdFail;