import axios from 'axios';
import React, { useEffect, useState } from 'react'

import "./ManagerMypage.css";

const ManagerMypage = ({ user }) => {
    const [reportsInfo, setReportsInfo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_REPORT_API_URL}/getReports`);

                setReportsInfo(response.data.map((report) => ({
                    reportID: report._id,
                    userID: report.Accused,
                    category: report.Category,
                    content: report.Detail_Reason,
                    url: report.Url
                })));
            } catch (e) {
                if (e.data.status !== 404) {
                    console.error(e);
                }
            }
        }

        fetchData();
    }, [])

    return (
        <div style={{ textAlign: "center" }}>
            <div className="container">
                <br></br>
                <h1>관리자 마이페이지</h1>
                <br></br>
                <p>현재 접속중인 계정: {user.nickname}({user.id})</p>
                <br></br>
                <h1 className='title-header'>신고 목록</h1>
                {reportsInfo.map((report, index) => (
                    <Report key={index} report={report} />
                ))}
            </div>
        </div>
    )
}

function Report({ report }) {
    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const handleSuspend = () => {
        const userBanFormUrl = `./board/banUser?user=${report.userID}&report=${report.reportID}`;
        const userBanFormWindow = window.open(userBanFormUrl, '_blank', 'width=600, height=400');

        userBanFormWindow.addEventListener('beforeunload', () => {
            window.location.reload();
        });
    };

    const handleComplete = async () => {
        try {
            await axios.patch(`${process.env.REACT_APP_REPORT_API_URL}/updateReportStatus`, { reportID: report.reportID })

            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    console.log(report);

    return (
        <div className='report-container'>
            <div className='report-header'>
                <div className='report-accused'><strong>아이디:</strong> {report.userID}</div>
                <div className='report-category'><strong>사유:</strong> {report.category}</div>
            </div>
            <div className='report-body'>
                <span className='report-content-btn' onClick={handleToggle}><strong>{expanded ? `▼ 닫기` : `▶ 펼치기`}</strong></span>
                {expanded && (
                    <>
                        <div className='report-content-container'>
                            <p className='report-content'>
                                <strong>주소</strong>: {report.url}
                            </p>
                            <p className='report-content'>
                                <strong>사유</strong>: {report.content}
                            </p>
                        </div>
                        <div className='report-btn-container'>
                            <button className='complete-btn' onClick={handleComplete}>처리 완료</button>
                            <button className='user-ban-btn' onClick={handleSuspend}>활동 정지</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManagerMypage;