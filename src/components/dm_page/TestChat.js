import "./TestChat.css";
import React, { useState } from 'react';

function Chat({ username, messages, setMessages }) {
    // 메시지를 전송하는 함수
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            // 메시지를 전송하고 messages 배열에 추가
            setMessages([...messages, { text: newMessage, sender: username }]);
            // 메시지 전송 후 입력 필드 비우기
            setNewMessage('');
        }
    };

    const deleteMessage = (index) => {
        // 메시지를 삭제하고 messages 배열에서 제거
        const updatedMessages = [...messages];
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
                            <button className="message-delete" onClick={() => deleteMessage(index)}>X</button>
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