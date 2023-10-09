import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

// javascript
import Chat from "./TestChat";
import ChatRoomList from "./TestChatRoomList";

// css
import "./TestDM.css";

const TestDM = () => {
    const [cookies] = useCookies(['loginID']);
    const [dmList, setDmList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedDM, setSelectedDM] = useState(null);

    useEffect(() => {
        // 데이터베이스에서 DM 목록 가져오기
        const loadDmList = async () => {
            const list = await axios.get("http://localhost:4000/dmPage/api/getDMList", {
                params: {
                    userID: cookies.loginID
                }
            });
            setDmList(list.data);
        }

        loadDmList().then();
    });

    return(
        <div className="container">
            <ChatRoomList
                dmList={dmList}
                selectedDM={selectedDM}
                setSelectedDM={setSelectedDM}
                setUserList={setUserList}/>
            <Chat 
                username={cookies.loginID} 
                selectedDM={selectedDM}
                userList={userList}/>
        </div>
    )
}
export default TestDM;