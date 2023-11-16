import React, { useState } from 'react';

const UserBan = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitted, setSubmitted] = useState(false);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleSubmit = () => {

    console.log('Selected User:', selectedUser);
    console.log('Reason:', reason);
    console.log('Duration:', duration);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
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
          onChange={handleUserChange}
        />
      </div>
      <div>
        <label htmlFor="reason">정지 사유:</label>
        <input
          type="text"
          id="reason"
          value={reason}
          onChange={handleReasonChange}
        />
      </div>
      <div>
        <label htmlFor="duration">정지 기간:</label>
        <select id="duration" value={duration} onChange={handleDurationChange}>
          <option value="1일">1일</option>
          <option value="1주">1주</option>
          <option value="1개월">1개월</option>
          <option value="1년">1년</option>
          <option value="영구정지">영구정지</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={isSubmitted}>
        {isSubmitted ? '처리 중...' : '유저 정지'}
      </button>
      {isSubmitted && <p>유저 정지 완료</p>}
    </div>
  );
};

export default UserBan;