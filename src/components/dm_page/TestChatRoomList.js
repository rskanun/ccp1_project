import React, { useEffect } from "react";
import axios from 'axios';

// css
import "./TestChatRoomList.css";

function ChatRoomList({ loginID, dmList, setDmList, selectedDM, setSelectedDM, setUserList }) {
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

    const handleLeaveChat = async (index, dm) => {
        const updateDmList = [...dmList];

        // 해당 DM을 데이터베이스 상에서 제거
        await axios.delete(`${process.env.REACT_APP_DM_API_URL}/exitDM`, {
            params: {
                dmID: dm.id,
                userID: loginID
            }
        }).then(() => {
            // UI 상에서 dm 제거
            updateDmList.splice(index, 1);
            setDmList(updateDmList);
        })
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
                    <button onClick={() => handleLeaveChat(index, dm)}>나가기</button>
                </div>
            ))}</ul>
        </div>
    )
}
export default ChatRoomList;