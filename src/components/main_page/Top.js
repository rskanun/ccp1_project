import React from "react";
import "./Top.css";

function Top(props) {
    return(
        <div className="top">
            <img src="/img/outsourcing.JPG"/>
            <a>로그인</a>
            <a>마이페이지</a>
            <a>유저 검색</a>
            <a>메세지</a>
            <hr></hr>
        </div>
    );
}
export default Top;