import React from "react";
import "./MainPage.css";
import fileImg from "./img/fileImg.jpg";
import testImg from "./img/testImg.png";

function Main() {
    function goToCategory(category) {
        window.location.href = 'http://localhost:3000/board/list?category='+category;
    }
    
    function goToReq(reqNumber) {
        window.location.href = 'http://localhost:4000/Req/'+reqNumber;
    }

    return(
        <div className="wholeMainBox">
            <div className="searchMainBox">
                <div className="searchInMain">
                    <input type="text" className="searchMainBar" placeholder="원하는 의뢰를 찾아보세요!"></input>
                </div>
                <div className="categoriesInMain">
                    <div id = "cat1" className="categoryInMain" onClick={() => goToCategory("illust")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>그림/일러스트</span>
                        </div>
                    </div>
                    <div id = "cat2" className="categoryInMain"onClick={() => goToCategory("code")}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>코딩</span>
                        </div>
                    </div>
                    <div id = "cat3" className="categoryInMain" onClick={() => goToCategory("music")}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>음악/작곡</span>
                        </div>
                    </div>
                    <div id = "cat4" className="categoryInMain" onClick={() => goToCategory("goods")}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>물품</span>
                        </div>
                    </div>
                    <div id = "cat5" className="categoryInMain" onClick={() => goToCategory("video")}>
                        <div className="catePic">
                        <img src={testImg} alt="파일 사진"  style={{ width: "100%", height: "70%" }}/>
                            <span>영상</span>
                        </div>
                    </div>
                    <div id = "cat6" className="categoryInMain" onClick={() => goToCategory("other")}>
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

                    <div className="requestInMain" onClick={() => goToReq(1)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request1》</strong></div>
                            <div className="requestCon"><strong>#Request1Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="requestInMain" onClick={() => goToReq(2)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request2》</strong></div>
                            <div className="requestCon"><strong>#Request2Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="requestInMain" onClick={() => goToReq(3)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request3》</strong></div>
                            <div className="requestCon"><strong>#Request3Con</strong></div>
                        </div>
                    </div>

                    <div className="requestInMain" onClick={() => goToReq(4)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request4》</strong></div>
                            <div className="requestCon"><strong>#Request4Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="requestInMain" onClick={() => goToReq(5)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request5》</strong></div>
                            <div className="requestCon"><strong>#Request5Con</strong></div>
                        </div>
                    </div>


                    
                    <div className="requestInMain" onClick={() => goToReq(6)}>
                        <img src={fileImg} alt="파일 사진"  style={{ width: "380px", height: "300px" }}/>
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《Request6》</strong></div>
                            <div className="requestCon"><strong>#Request6Con</strong></div>
                        </div>
                    </div>
                    

                </div>
            </div>
        
            
        </div>

    );
   
}

export default Main;