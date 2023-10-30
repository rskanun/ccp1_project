import React from "react";
import "./Top.css";

import logo from "./img/outsourcing.jpg"

function Top() {
    return(
        <div className="top">
            <img src={logo}/>
            <a>로그인</a>
            <a>마이페이지</a>
            <a>유저 검색</a>
            <a>메세지</a>
            <hr></hr>
        </div>
    );
}
export default Top;