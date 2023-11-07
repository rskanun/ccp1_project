import React, { useState } from 'react';
import FindResult from './FindResult';

import './FindAcc.css';
import axios from 'axios';

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
  const [email, setEmail] = useState('');

  const FindAccountID = async () => {
    // 데이터베이스 조회 후 아이디 찾는 과정
    await axios.get(`${process.env.REACT_APP_LOGIN_API_URL}/findID`, {
      params: {
        email: email
      }
    }).then((res) => {
      const findType = "id";
      const findData = res.data.id;

      setFindAccData({
        findType: findType,
        data: findData
      });
    }).catch((e) => {
      // 못 찾았을 경우
    })
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      FindAccountID();
    }
  }

  return( isIdSelected &&
    <div id="findIdDiv" className="findId">
      <br />
      <span className="enterEmailMeaasge">이메일을 입력해주세요!</span>
      <br /> &nbsp;e-mail :&nbsp;
      <input type="text"
        className="inputEmail"
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}/>
      <br />
      <button className="check" onClick={FindAccountID}>
        아이디 찾기
      </button>
      <br />
    </div>
  )
}

function FindPW({ isPwSelected, setFindAccData }) {
  const [id, setID] = useState('');
  const [email, setEmail] = useState('');

  const FindAccountPW = async () => {
    // 데이터베이스 조회 후 비밀번호를 찾는 과정
    await axios.get(`${process.env.REACT_APP_LOGIN_API_URL}/findPassword`, {
      params: {
        email: email,
        id: id
      }
    }).then((res) => {
      const findType = "password";
      const findData = res.data.password;

      setFindAccData({
        findType: findType,
        data: findData
      });
    })
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      FindAccountPW();
    }
  }

  return ( isPwSelected && 
    <div id="findPwDiv" className="findPw">
      <br />
      <span className="enterEmailMeaasge">아이디/이메일을 입력해주세요!</span>
      <br /> &nbsp;e-mail :&nbsp;
      <input type="text" 
        className="inputEmail" 
        placeholder="이메일" 
        onChange={(e) => setEmail(e.target.value)}/>
      <br /> 아이디 :&nbsp;
      <input type="text" 
        className="inputId" 
        placeholder="아이디" 
        onChange={(e) => setID(e.target.value)}
        onKeyDown={handleKeyDown}/>
      <br />
      <button id="openWindowButton" className="check" onClick={FindAccountPW}>
        비밀번호 찾기
      </button>
      <br />
    </div>
  );
}