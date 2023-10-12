import React, { useState } from 'react';
import FindResult from './FindResult';

import './FindAcc.css';

function FindAcc() {
  const [isIdSelected, setIsIdSelected] = useState(true);
  const [findAccData, setFindAccData] = useState(null);

  return (
    findAccData ? <FindResult findAccData={findAccData}/>
      : (
        <div className="wholeBox">
          <HeaderLayout 
            isIdSelected={isIdSelected}
            setIsIdSelected={setIsIdSelected}
          />
          <FindID 
            isIdSelected={isIdSelected === true} 
            setFindAccData={setFindAccData}/>
          <FindPW 
            isPwSelected={isIdSelected === false}
            setFindAccData={setFindAccData}/>
        </div>
      )
  )
}
export default FindAcc;

function HeaderLayout({ isIdSelected, setIsIdSelected }) {
  const handleIdButtonClick = () => {
    setIsIdSelected(true);
  };

  const handlePwButtonClick = () => {
    setIsIdSelected(false);
  };

  return (
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
          className={isIdSelected ? 'notSelected' : 'selected'}
          onClick={handlePwButtonClick}
        >
          비밀번호 찾기
        </button>
    </div>
  );
}

function FindID({ isIdSelected, setFindAccData }) {
  const FindAccountID = () => {
    // 데이터베이스 조회 후 아이디 찾는 과정
    const findType = "id";
    const findData = "findID";

    setFindAccData({
      findType: findType,
      data: findData
    });
  }

  return( isIdSelected &&
    <div id="findIdDiv" className="findId">
      <br />
      <span className="enterEmailMeaasge">이메일을 입력해주세요!</span>
      <br />
      <input type="text" className="inputEmail" placeholder="이메일" />
      <br />
      <button className="check" onClick={FindAccountID}>
        아이디 찾기
      </button>
      <br />
    </div>
  )
}

function FindPW({ isPwSelected, setFindAccData }) {
  const FindAccountPW = () => {
    // 데이터베이스 조회 후 비밀번호를 찾는 과정
    const findType = "password";
    const findData = "findPW";

    setFindAccData({
      findType: findType,
      data: findData
    });
  }

  return ( isPwSelected && 
    <div id="findPwDiv" className="findPw">
      <br />
      <span className="enterEmailMeaasge">아이디/이메일을 입력해주세요!</span>
      <br />
      <input type="text" className="inputEmail" placeholder="이메일" />
      <br />
      <input type="text" className="inputId" placeholder="아이디" />
      <br />
      <button id="openWindowButton" className="check" onClick={FindAccountPW}>
        비밀번호 찾기
      </button>
      <br />
    </div>
  );
}