import React, { useEffect, useState } from 'react';
import axios from 'axios';

// javascript
import Chat from "./TestChat";
import ChatRoomList from "./TestChatRoomList";

// css
import "./TestDM.css";

const TestDM = ({loginID}) => {
    const [dmList, setDmList] = useState([]);
    const [selectedDM, setSelectedDM] = useState(null);

    useEffect(() => {
        // 데이터베이스에서 DM 목록 가져오기
        const loadDmList = async () => {
            const list = await axios.get("http://localhost:4000/dmPage/api/getDMList", {
                params: {
                    userID: loginID
                }
            });
            setDmList(list.data);
        }

        loadDmList().then();
    }, [loginID]);

    return(
        <div className="container">
            <ChatRoomList dmList={dmList} selectedDM={selectedDM} setSelectedDM={setSelectedDM}/>
            <Chat username={loginID} selectedDM={selectedDM}/>
        </div>
    )
}
export default TestDM;