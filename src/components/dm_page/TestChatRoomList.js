import React, { useState } from "react";

// css
import "./TestChatRoomList.css";

const ChatRoomList = () => {
    const chatList = [
        {name: "test"},
        {name: "test2"}
    ]
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (index) => {
        setSelectedItem(index === selectedItem ? null : index);
    };

    return(
        <div className="chat-sidebar">
            <h2>채팅방 목록</h2>
            <ul>{chatList.map((dm, index) => (
                <li key={index}
                    onClick={() => handleItemClick(index)}
                    className={index === selectedItem ? "selected" : ""}>
                        {dm.name}
                </li>
            ))}</ul>
        </div>
    )
}
export default ChatRoomList;