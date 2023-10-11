import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// javascript
import Chat from "./TestChat";
import ChatRoomList from "./TestChatRoomList";

// css
import "./TestDM.css";

function TestDM() {
    const [id, setID] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                setID(res.data.id);
            } catch (e) {
                removeCookie('loginID'); // 쿠키 삭제
                navigate('/login'); // 로그인 페이지 이동
            }
        }

        userCheck();
    }, []);

    return id ? (<DM loginID={id}/>)
        : null;
}
export default TestDM;

function DM({loginID}) {
    const [dmList, setDmList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedDM, setSelectedDM] = useState(null);

    useEffect(() => {
        // 데이터베이스에서 DM 목록 가져오기
        const loadDmList = async () => {
            const list = await axios.get(`${process.env.REACT_APP_LOGIN_API_URL}/getDMList`, {
                params: {
                    userID: loginID
                }
            });
            setDmList(list.data);
        }

        loadDmList().then();
    }, [setDmList]);

    return(
        <div className="container">
            <ChatRoomList
                loginID={loginID}
                dmList={dmList}
                setDmList={setDmList}
                selectedDM={selectedDM}
                setSelectedDM={setSelectedDM}
                setUserList={setUserList}/>
            <Chat 
                username={loginID} 
                selectedDM={selectedDM}
                userList={userList}/>
        </div>
    )
}