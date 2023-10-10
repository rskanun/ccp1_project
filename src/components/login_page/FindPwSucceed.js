import React, { useState } from 'react';
import './FindPwSucceed.css';


function NoticePwSucceed() {
    const openLoginPage = () => {
        const login = 'http://outsourcing/loginPage/login'; 
        window.open(login, '_blank', 'width=400,height=300');
      };

    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticePW">
                <span style={{ fontWeight: 'bold' }}>찾은 비밀번호</span>
            </div>
            <br/>
            <div className="noticePWText">
                <span>매칭되는 비밀번호를 찾았습니다!</span>
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

export default NoticePwSucceed;