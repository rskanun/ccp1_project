import axios from 'axios';
import React, { useEffect, useState } from 'react'

import "./ManagerMypage.css";

const ManagerMypage = ({ user }) => {
    const [reporstInfo, setReportsInfo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_REPORT_API_URL}/getReports`);

                setReportsInfo(response.data.map((report) => ({
                    reportID: report._id,
                    userID: report.Accused,
                    category: report.Category,
                    content: report.Detail_Reason
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
                {reporstInfo.map((report, index) => (
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

    return (
        <div className='report-container'>
            <div className='report-header'>
                <div className='report-accused'><strong>아이디:</strong> {report.userID}</div>
                <div className='report-category'><strong>사유:</strong> {report.category}</div>
            </div>
            <div className='report-body' onClick={handleToggle}>
                <span className='report-content-btn'><strong>{expanded ? `▼ 닫기` : `▶ 펼치기`}</strong></span>
                {expanded && (
                    <>
                        <p className='report-content'>{report.content}</p>
                        <button className='user-ban-btn' onClick={handleSuspend}>활동 정지</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManagerMypage;