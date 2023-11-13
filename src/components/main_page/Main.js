import React from "react";
import "./Main.css";
import fileImg from "./fileImg.png";
import testImg from "./testImg.png";

function Main(props) {


    function goToCategory(categoryNumber) {
        window.location.href = 'http://localhost:4000/mainPage/cat'+categoryNumber;
    }
    
    function goToReq(reqNumber) {
        window.location.href = 'http://localhost:4000/Req/'+reqNumber;
    }

    return(
        <div className="wholeMainBox">
            <div className="searchMainBox">
                <div className="search">
                    <input type="text" className="searchMainBar" placeholder="원하는 의뢰를 찾아보세요!"></input>
                </div>
                <div className="categoriesInMain">
                    <div id = "cat1" className="categoryInMain" onClick={() => goToCategory(1)}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>그림/일러스트</span>
                        </div>
                    </div>
                    <div id = "cat2" className="categoryInMain"onClick={() => goToCategory(2)}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>코딩</span>
                        </div>
                    </div>
                    <div id = "cat3" className="categoryInMain" onClick={() => goToCategory(3)}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>음악/작곡</span>
                        </div>
                    </div>
                    <div id = "cat4" className="categoryInMain" onClick={() => goToCategory(4)}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>물품 제작</span>
                        </div>
                    </div>
                    <div id = "cat5" className="categoryInMain" onClick={() => goToCategory(5)}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>공연</span>
                        </div>
                    </div>
                    <div id = "cat6" className="categoryInMain" onClick={() => goToCategory(6)}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>기타</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="recentRequestBox">
                <div className="recentRequestText">
                    <h1>Recent Request</h1>
                </div>

                <div className="requestMainBar">

                    <div className="request" onClick={() => goToReq(1)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request1</strong></div>
                            <div className="requestCon"><strong>#Request1Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="request" onClick={() => goToReq(2)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request2</strong></div>
                            <div className="requestCon"><strong>#Request2Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="request" onClick={() => goToReq(3)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request3</strong></div>
                            <div className="requestCon"><strong>#Request3Con</strong></div>
                        </div>
                    </div>

                    <div className="request" onClick={() => goToReq(4)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request4</strong></div>
                            <div className="requestCon"><strong>#Request4Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="request" onClick={() => goToReq(5)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request5</strong></div>
                            <div className="requestCon"><strong>#Request5Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="request" onClick={() => goToReq(6)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInfo">
                            <div className="requestName"><strong>프로젝트 명 - Request6</strong></div>
                            <div className="requestCon"><strong>#Request6Con</strong></div>
                        </div>
                    </div>
                    

                </div>
            </div>

           
            
        </div>

    );
   
}

export default Main;