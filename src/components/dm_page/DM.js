import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// javaScript
import ChatList from "./ChatList";
import Chatting from "./Chatting";

// css
import './DM.css';

function DmPage() {
    const [id, setID] = useState('');
    const [cookies, removeCookie] = useCookies(['loginID']);
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
    }, [cookies.loginID]);

    return id ? (<DM loginID={id}/>)
        : null;
}
export default DmPage;

function DM({loginID}) {
    const [dmList, setDmList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedDM, setSelectedDM] = useState(null);
    const [selectedDmIndex, setSelectedDmIndex] = useState(null);

    useEffect(() => {
        // 데이터베이스에서 DM 목록 가져오기
        const loadDmList = async () => {
            const list = await axios.get(`${process.env.REACT_APP_DM_API_URL}/getDMList`, {
                params: {
                    userID: loginID
                }
            });
            setDmList(list.data);
        }

        loadDmList().then();
    }, [setDmList]);
  
    return (
        <div className='whole_box'>
            <div className='dm_box'>
                <ChatList 
                    loginID={loginID}
                    dmList={dmList}
                    selectedDM={selectedDM}
                    setSelectedDM={setSelectedDM}
                    setSelectedDmIndex={setSelectedDmIndex}
                    setUserList={setUserList}/>
                <Chatting 
                    loginID={loginID}
                    selectedDmIndex={selectedDmIndex}
                    dmList={dmList}
                    setDmList={setDmList}
                    selectedDM={selectedDM}
                    setSelectedDM={setSelectedDM}
                    userList={userList}
                />
            </div>
        </div>
    );
}