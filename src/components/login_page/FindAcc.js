import React, { useState } from 'react';
import './TestFindAcc.css';

function FindAcc() {
  const [isIdSelected, setIsIdSelected] = useState(true);
  const [isPwSelected, setIsPwSelected] = useState(false);

  const handleIdButtonClick = () => {
    setIsIdSelected(true);
    setIsPwSelected(false);
  };

  const handlePwButtonClick = () => {
    setIsIdSelected(false);
    setIsPwSelected(true);
  };

  const openNewWindow = () => {
    const newWindowUrl = 'Home.js'; //로그인 상태로 메인 화면 이동
    window.open(newWindowUrl, '_blank', 'width=400,height=300');
  };

  return (
    <div className="wholeBox">
      <div className="findBox">
        <button
          id="showIdButton"
          className={isIdSelected ? 'selected' : 'notSelected'}
          onClick={handleIdButtonClick}
        >
          아이디 찾기
        </button>
        <button
          id="showPwButton"
          className={isPwSelected ? 'selected' : 'notSelected'}
          onClick={handlePwButtonClick}
        >
          비밀번호 찾기
        </button>
      </div>

      {isIdSelected && (
        <div id="findIdDiv" className="findId">
          <br />
          <span className="enterEmailMeaasge">이메일을 입력해주세요!</span>
          <br />
          <input type="text" className="inputEmail" placeholder="이메일" />
          <br />
          <button className="check">아이디 찾기</button>
          <br />
        </div>
      )}

      {isPwSelected && (
        <div id="findPwDiv" className="findPw">
          <br />
          <span className="enterEmailMeaasge">아이디를 입력해주세요!</span>
          <br />
          <input type="text" className="inputId" placeholder="아이디" />
          <br />
          <button id="openWindowButton" className="check">
            비밀번호 찾기
          </button>
          <br />
        </div>
      )}
    </div>
  );
}

export default FindAcc;