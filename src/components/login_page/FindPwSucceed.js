import React, { useState } from 'react';
import './FindPwSucceed.css';


function NoticePwSucceed() {
    
    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticePW">
                <span style={{ fontWeight: 'bold' }}>찾은 비밀번호</span>
            </div>
            <br/><br/>
            <div className="noticePWText">
                <span>매칭되는 비밀번호를 찾았습니다!</span>
            </div>
        </div>
    )
}

export default NoticePwSucceed;