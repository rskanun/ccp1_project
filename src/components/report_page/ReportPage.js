import axios from "axios";
import React, { useState } from "react";
import "./ReportPage.css";

const ReportPage = () => {
    const [isReport, setReport] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [detailReason, setDetailReason] = useState("");

    const handleReport = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('user');

        try {
            const response = await axios.post(`${process.env.REACT_APP_REPORT_API_URL}/sendReport`, {
                userID,
                reason: selectedReason,
                content: detailReason
            });

            if (response.status === 200) {
                setReport(true);
            }
        } catch (e) {
            alert("신고 과정에서 오류가 발생했습니다!\n", e);
        }
    }

    const handleGoBack = () => {
        window.close();
    }

    return (
        <div className="reportWholePage">
            {!isReport &&
                <>
                    <span className="reportNameText">신고</span>
                    <div className="selectReportReason">
                        <label className="reportReasonList">
                            <span className="reportReasonText">신고 사유</span>
                            <select onChange={(e) => setSelectedReason(e.target.value)} value={selectedReason}>
                                <option value="">선택하세요</option>
                                <option>부적절한/음란성/거짓 게시물 게시</option>
                                <option>부적절한/음란성/ 발언 적발</option>
                                <option>불법/사기 행위의 적발</option>
                                <option>부적절한/음란성/거짓 프로필 등록</option>
                                <option>기타</option>
                            </select>
                        </label>
                        <br /><br />
                        <label className="reportDetailReasonList">
                            <span className="reportDetailReasonText">상세 설명</span>
                            <br />
                            <textarea
                                className="writeReportDetailReason"
                                placeholder="상세내용을 기술해 주세요."
                                value={detailReason}
                                onChange={(e) => setDetailReason(e.target.value)}
                            ></textarea>
                        </label>
                    </div>
                    <div className="reportBtnList">
                        <button
                            className="reportDoBtn"
                            onClick={handleReport}
                            disabled={selectedReason === "" || detailReason === ""}
                        >
                            신고
                        </button>
                        <button className="reportBackBtn" onClick={handleGoBack}>취소</button>
                    </div>
                </>
            }
            {isReport &&
                <div className="endReport">
                    <span className="thxForReport">신고해 주셔서 감사합니다!</span>
                    <button onClick={handleGoBack}>닫기</button>
                </div>
            }
        </div>
    );
};

export default ReportPage;
