import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import "./Top.css";

import logo from "./img/outsourcing.jpg";
import axios from "axios";

function Top() {
  const [id, setID] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["loginID"]);

  useEffect(() => {
    // 로그인 체크
    const userCheck = async () => {
      const token = cookies.loginID;
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
          { token: token }
        );
        const id = res.data.id;

        setID(id);
        getUserInfo(id);
      } catch (e) {
        if (e.response.status !== 404 && e.response.status !== 400) {
          console.error(e);
        }
      }
    };

    // 유저 펄미션 가져오기
    const getUserInfo = async (id) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_USER_API_URL}/getUserInfo`,
          {
            params: { id },
          }
        );

        setIsAdmin(response.data.Permission_Level >= 2);
      } catch (e) {
        console.error(e);
      }
    };

    userCheck();
  }, [cookies.loginID]);

  const handleLogout = (e) => {
    e.preventDefault();

    // 쿠키 삭제
    removeCookie("loginID", { path: "/" });

    window.location.reload();
  };

  const handleSuspend = () => {
    const userBanFormUrl = `./board/banUser`;
    const userBanFormWindow = window.open(userBanFormUrl, '_blank', 'width=600, height=400');

    userBanFormWindow.addEventListener('beforeunload', () => {
        window.location.reload();
    });
};

  return (
    <div className="top">
      <a href="/">
        <img src={logo} alt="Logo" />
      </a>
      {id ? (
        <a href="#" className="menu" onClick={handleLogout}>
          로그아웃
        </a>
      ) : (
        <a href="/login" className="menu">
          로그인
        </a>
      )}
      {id ? (
        <a href="/mypage" className="menu">
          마이페이지
        </a>
      ) : null}
      <a href="/findUser" className="menu">
        유저 검색
      </a>
      {id && !isAdmin ? (
        <a href="/DM" className="menu">
          DM
        </a>
      ) : null}
      {isAdmin ? (
        <a href="#" className="menu" onClick={handleSuspend}>
          유저 활동 정지
        </a>
      ) : null}
      <hr></hr>
    </div>
  );
}
export default Top;
