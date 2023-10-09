import React, { useEffect } from "react";
import axios from 'axios';

// css
import "./TestChatRoomList.css";

function ChatRoomList({ dmList, selectedDM, setSelectedDM, setUserList }) {
    useEffect(() => {
        const loadUserList = async () => {
            const list = await axios.get(`${process.env.REACT_APP_DM_API_URL}/getUserList`, {
                params: {
                    dmID: selectedDM
                }
            });
            setUserList(list.data);
        }

        loadUserList().then();
    }, [selectedDM]);

    const handleItemClick = (dmID) => {
        setSelectedDM(dmID);
    };

    const handleLeaveChat = (dmID) => {
        // 여기에 채팅방을 나가는 동작을 정의합니다.
        // 예를 들어, API를 호출하여 채팅방에서 나가는 요청을 보낼 수 있습니다.
    };

    return(
        <div className="chat-sidebar">
            <h2>채팅방 목록</h2>
            <ul>{dmList.map((dm, index) => (
                <div className="chat-item" key={index}>
                    <li onClick={() => handleItemClick(dm.id)}
                    className={dm.id === selectedDM ? "selected" : ""}>
                        {dm.name}
                    </li>
                    <button onClick={() => handleLeaveChat(dm.id)}>나가기</button>
                </div>
            ))}</ul>
        </div>
    )
}
export default ChatRoomList;