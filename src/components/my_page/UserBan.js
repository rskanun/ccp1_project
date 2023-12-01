import axios from 'axios';
import React, { useEffect, useState } from 'react';

const urlParams = new URLSearchParams(window.location.search);

const UserBan = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('1');
  const [isSubmitted, setSubmitted] = useState(false);
  
  const userID = urlParams.get('user');
  const reportID = urlParams.get('report');

  useEffect(() => {
    setSelectedUser(userID);
  }, [window.location.href])

  const handleSubmit = async () => {
    try {
      const banResponse = await axios.post(`${process.env.REACT_APP_REPORT_API_URL}/userBan`, {
        userID: selectedUser,
        reason,
        duration
      });

      const reportResponse = (reportID) ?
        await axios.patch(`${process.env.REACT_APP_REPORT_API_URL}/updateReportStatus`, { reportID })
        :
        {status: 200};


      if (banResponse.status === 200 && reportResponse.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          window.close();
        }, 2000);
      }

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>유저 정지</h1>
      <div>
        <label htmlFor="user">정지 대상 유저:</label>
        <input
          type="text"
          id="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="reason">정지 사유:</label>
        <input
          type="text"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="duration">정지 기간:</label>
        <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="1">1일</option>
          <option value="7">1주</option>
          <option value="30">1개월</option>
          <option value="365">1년</option>
          <option value="-1">영구정지</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={isSubmitted}>
        {isSubmitted ? '처리 중...' : '유저 정지'}
      </button>
    </div>
  );
};

export default UserBan;