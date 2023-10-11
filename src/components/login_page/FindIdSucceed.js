import React, { useState } from 'react';
import './FindIdSucceed.css';


function NoticeIdSucceed() {
    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticeID">
                <span style={{ fontWeight: 'bold' }}>찾은 아이디</span>
            </div>
            <br/><br/>
            <div className="noticeIDText">
                <span>매칭되는 아이디를 찾았습니다!</span>
            </div>
        </div>
    )
}

export default NoticeIdSucceed;