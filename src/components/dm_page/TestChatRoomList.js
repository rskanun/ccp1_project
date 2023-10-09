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

    return(
        <div className="chat-sidebar">
            <h2>채팅방 목록</h2>
            <ul>{dmList.map((dm, index) => (
                <li key={index}
                    onClick={() => handleItemClick(dm.id)}
                    className={dm.id === selectedDM ? "selected" : ""}>
                        {dm.name}
                </li>
            ))}</ul>
        </div>
    )
}
export default ChatRoomList;