import React, { useState } from 'react';
import './FindIdFail.css';


function NoticeIdFail() {

    return(
        <div className="wholeBox">
            <br/><br/>
            <div className="noticeFailText">
                <span style={{ fontWeight: 'bold' }}>매칭되는 아이디를 찾지 못했습니다.</span>
            </div>
            <br/><br/>
            <div className="noticeIDText2">
                <span>일치하는 아이디가 없습니다.</span>
            </div>
            
        </div>
    )
}

export default NoticeIdFail;