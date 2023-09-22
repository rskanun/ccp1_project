import React, { useState } from 'react';
import axios from 'axios';
// css
import "./TestChat.css";

function Chat({ username, messages, setMessages }) {
    // 메시지를 전송하는 함수
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const nowDate = new Date();

            // 메시지를 전송하고 messages 배열에 추가
            setMessages([...messages, { text: newMessage, sender: username, date: nowDate }]);

            // 해당 메세지 데이터베이스에 추가
            const data = {
                //DM_ID: ...
                Content: newMessage,
                Sender: username,
                Date: nowDate
            }
            axios.post("http://localhost:4000/dmPage/api/sendDM", data).then();

            // 메시지 전송 후 입력 필드 비우기
            setNewMessage('');
        }
    };

    const deleteMessage = (index, date) => {
        const updatedMessages = [...messages];

        // 해당 메시지를 데이터베이스 상에서 제거
        axios.delete("http://localhost:4000/dmPage/api/deleteDM", {
            params: {
                date: date
            }
        });

        // messages 배열에서 제거하여 UI 상에서 삭제
        updatedMessages.splice(index, 1);
        setMessages(updatedMessages);
    };

    return (
        <div className="chat-container">
            <div/>
                <div className="message-list">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        {message.sender === username && (
                            <button className="message-delete" onClick={() => deleteMessage(index, message.date)}>X</button>
                        )}
                        <div key={index} className={`${message.sender === username ? 'self-message' : 'other-user-message'}`}>
                            {message.text}
                    </div>
                </div>
            ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}

export default Chat;