import React, { useState } from 'react';
import './FindAcc.css';

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

  const openFindIdWindow = () => {
    //성공시 찾은 아이디/비번을 알리는 창을 띄움, 아니면 실패 결과창을 알리는 창을 띄움
    const found = './login/FindIdSuccess'; 
    const notFound = './login/FindIdFail'; 
    //if문 처리 예정
    window.open(found, '_blank', 'width=400,height=300');
  };

  const openFindPwWindow = () => {
    //성공시 찾은 아이디/비번을 알리는 창을 띄움, 아니면 실패 결과창을 알리는 창을 띄움
    const found = './login/FindPwSuccess'; 
    const notFound = './login/FindPwFail'; 
    //if문 처리 예정
    window.open(found, '_blank', 'width=400,height=300');
  };

  const handleFindAccWindowClosed = () => {
    // 부모 창에 메시지를 보냅니다.
    window.opener.postMessage("findAccWindowClosed", "*");

    // 새로운 창을 닫습니다.
    window.close();
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
          <button className="check" onClick={openFindIdWindow}>
            아이디 찾기
            </button>
          <br />
        </div>
      )}

      {isPwSelected && (
        <div id="findPwDiv" className="findPw">
          <br />
          <span className="enterEmailMeaasge">아이디/이메일을 입력해주세요!</span>
          <input type="text" className="inputEmail" placeholder="이메일" />
          <input type="text" className="inputId" placeholder="아이디" />
          <br />
          <button id="openWindowButton" className="check" onClick={openFindPwWindow}>
            비밀번호 찾기
          </button>
          <br />
        </div>
      )}
    </div>
  );
}

export default FindAcc;