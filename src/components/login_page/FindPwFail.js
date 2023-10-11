import React, { useState } from 'react';
import './FindPwFail.css';


function NoticeIdFail() {

    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticeFailText">
                <span style={{ fontWeight: 'bold' }}>매칭되는 비밀번호를 찾지 못했습니다.</span>
            </div>
            <br/><br/>
            <div className="noticeFailText2">
                <span>일치하는 비밀번호가 없습니다.</span>
            </div>
        </div>
    )
}

export default NoticeIdFail;