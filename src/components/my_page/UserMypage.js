import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './UserMypage.css';

function UserMypage({user}) {
  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <p>현재 접속중인 계정: <a href='/profile'>{user.nickname}({user.id})</a></p>
      <hr />
      <UserInfoPage user={user}/>
    </div>
  );
}

function UserInfoPage({user}) {
  const [userInfo, setUserInfo] = useState({});
  const [submit, setSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_USER_API_URL}/updateUserInfo`, {
          id: user.id,
          email: userInfo.email,
          password: (userInfo.password !== '') ? userInfo.password : user.password,
          nickname: userInfo.nickname,
        });

        if (response.status === 200) {
          alert('회원 정보 변경이 완료되었습니다.');
          window.location.reload();
        }
      } catch (error) {
        alert('회원 정보 변경 중 오류가 발생했습니다.');
      }
    }
  };

  const checkNickname = async (nickname) => {
    if (nickname && nickname !== user.nickname) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_USER_API_URL}/checkInvalidNickname`, {
          params: { nickname },
        });
        if (response.status === 200) {
            const isValidNickname = true;
            setUserInfo({ ...userInfo, nickname, isValidNickname });
            setErrors(validate({ ...userInfo, nickname, isValidNickname }));
        }
      } catch (e) {
        const isValidNickname = false;
        setUserInfo({ ...userInfo, nickname, isValidNickname });
        setErrors(validate({ ...userInfo, nickname, isValidNickname }));
      }
    } else {
        setUserInfo({ ...userInfo, nickname });
        setErrors(validate({ ...userInfo, nickname }));
      }
  };

  useEffect(() => {
    setUserInfo({
      email: user.email,
      password: '',
      nowPassword: user.password,
      nickname: user.nickname,
      isValidNickname: true
    });
  }, [user]);

  useEffect(() => {
    setSubmit(Object.keys(errors).length === 0 &&
        checkUserInfoChanged(userInfo, user));
  }, [errors, userInfo]);

  return (
    user && (
        <form className="info-form" onSubmit={handleSubmit}>
      <ul>
        <li> 이메일
          <input
            className={`info-input ${errors.email ? 'error' : ''}`}
            type="email"
            defaultValue={userInfo.email}
            placeholder="&nbsp;&nbsp;이메일"
            name="email"
            autoComplete="off"
            onChange={(e) => {
              const email = e.target.value;
              setUserInfo((prevUserInfo) => ({ ...prevUserInfo, email }));
              setErrors(validate({ ...userInfo, email }));
            }}
          />
        </li>
        {errors.email && <span className="form-error">이메일: {errors.email}</span>}
        <li> 비밀번호
          <input
            className={`info-input ${errors.password ? 'error' : ''}`}
            type="password"
            placeholder="&nbsp;&nbsp;변경할 비밀번호"
            name="password"
            onChange={(e) => {
              const password = e.target.value;
              setUserInfo((prevUserInfo) => ({ ...prevUserInfo, password, nowPassword: user.password }));
              setErrors(validate({ ...userInfo, password, nowPassword: user.password }));
            }}
          />
        </li>
        {errors.password && <span className="form-error">비밀번호: {errors.password}</span>}
        <li> 이름
          <input
            className={`info-input ${errors.nickname ? 'error' : ''}`}
            type="nickname"
            defaultValue={userInfo.nickname}
            placeholder="&nbsp;&nbsp;이름을 입력하세요"
            name="nickname"
            autoComplete="off"
            onChange={(e) => checkNickname(e.target.value)}
          />
        </li>
        {errors.nickname && <span className="form-error">{errors.nickname}</span>}
      </ul>
      <input className="info-input submit-button" type="submit" value="변경하기" disabled={!submit} />
    </form>
    )
  );
}

const validate = (input) => {
  const { email, password, nowPassword, nickname, isValidNickname } = input;
  const errors = {};

  if (email === '') {
    errors.email = '이메일이 입력되지 않았습니다.';
  } else if (!/^[a-z0-9%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(email)) {
    errors.email = '입력된 이메일이 유효하지 않습니다.';
  }

  if (password && password === nowPassword) {
    errors.password = '기존 비밀번호와 동일합니다.';
  } else if (password && password.length < 8) {
    // errors.password = '8자 이상의 패스워드를 사용해야 합니다.';
  }

  if (nickname === '') {
    errors.nickname = '닉네임이 입력되지 않았습니다.';
  } else if (nickname && nickname.length > 9) {
    errors.nickname = '닉네임이 너무 깁니다. 9자 이하의 닉네임을 사용해주세요.';
  } else if (nickname && !isValidNickname) {
    errors.nickname = '유효하지 않은 닉네임입니다.';
  }

  return errors;
};

const checkUserInfoChanged = (nowUserInfo, originUserInfo) => {
    const { nickname, password, email } = nowUserInfo;

    const isNicknameChanged = nickname !== originUserInfo.nickname;
    const isPasswordChanged = password !== originUserInfo.password && password !== '';
    const isEmailChanged = email !== originUserInfo.email;

    return isNicknameChanged || isPasswordChanged || isEmailChanged;
}

export default UserMypage;
