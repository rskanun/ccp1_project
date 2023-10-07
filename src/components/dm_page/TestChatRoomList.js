import React from "react";

// css
import "./TestChatRoomList.css";

const ChatRoomList = ({ dmList, selectedDM, setSelectedDM }) => {
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