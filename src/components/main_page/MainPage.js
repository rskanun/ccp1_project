import React, { useEffect, useState } from "react";
import "./MainPage.css";
import fileImg from "./img/fileImg.jpg";
import testImg from "./img/testImg.png";
import axios from "axios";

function Main() {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchText !== '') {
            const encodedSearch = encodeURIComponent(searchText);
            window.location.href = 'http://localhost:3000/board/list?search=' + encodedSearch;
        }
    }

    return (
        <div className="wholeMainBox">
            <div className="searchMainBox">
                <div className="searchInMain">
                    <input
                        type="text"
                        className="searchMainBar"
                        placeholder="원하는 의뢰를 찾아보세요!"
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <div className="categoriesInMain">
                    <div id="cat1" className="categoryInMain" onClick={() => goToCategory("draw")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>그림/일러스트</span>
                        </div>
                    </div>
                    <div id="cat2" className="categoryInMain" onClick={() => goToCategory("program")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>코딩</span>
                        </div>
                    </div>
                    <div id="cat3" className="categoryInMain" onClick={() => goToCategory("music")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>음악/작곡</span>
                        </div>
                    </div>
                    <div id="cat4" className="categoryInMain" onClick={() => goToCategory("goods")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>물품</span>
                        </div>
                    </div>
                    <div id="cat5" className="categoryInMain" onClick={() => goToCategory("video")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>영상</span>
                        </div>
                    </div>
                    <div id="cat6" className="categoryInMain" onClick={() => goToCategory("other")}>
                        <div className="catePic">
                            <img src={testImg} alt="파일 사진" style={{ width: "100%", height: "70%" }} />
                            <span>기타</span>
                        </div>
                    </div>
                </div>
            </div>
            <RequestBox />
        </div>

    );

}

function RequestBox() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getMainReqs`);

                const reqList = await Promise
                    .all(response.data.posts.map(async (post) => {

                        return ({
                            ...post,
                            category: (post.category === 'other') ? post.otherCategory : post.category
                        });
                    }))

                setRequests(reqList);
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [])

    return (
        <div className="recentRequestBox">
            <div className="recentRequestText">
                <h1>Recent Request</h1>
            </div>
            <div className="requestMainBar">
                {requests.map((req, index) => (
                    <div className="requestInMain" key={index} onClick={() => goToReq(req.id)}>
                        <img src={fileImg} alt="파일 사진" style={{ width: "380px", height: "300px" }} />
                        <div className="requestInMainInfo">
                            <div className="requestInMainName"><strong>《{req.title}》</strong></div>
                            <div className="requestCon"><strong>#{req.category}</strong></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const goToCategory = (category) => {
    window.location.href = 'http://localhost:3000/board/list?category=' + category;
}

const goToReq = (reqId) => {
    if(reqId && reqId !== '') {
        window.location.href = 'http://localhost:3000/board/read?_id=' + reqId;
    }
    else {
        window.location.href = 'http://localhost:3000/board/write';
    }
}

export default Main;