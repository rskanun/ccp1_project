import React, { useState, useEffect } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';
// css
import "./TestChat.css";


function Chat({ username }) {
    // 메시지를 전송하는 함수
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // 데이터베이스에서 메세지 가져오기
        const loadDM = async () => {
            const loadData = await axios.get("http://localhost:4000/dmPage/api/DMdata");
            setMessages(loadData.data);
        }

        loadDM().then();
        
        // 새 DM이 도착했을 경우 실시간 업데이트
        socketIO.on("newMessage", (msg) => {
            setMessages(prevMessages => [...prevMessages, { text: msg.Content, sender: msg.Sender, date: msg.Date }]);
        });

        // DM이 삭제됐을 경우 실시간 업데이트
        socketIO.on("delMessage", (msg) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages.splice(msg.index, 1);
                return updatedMessages;
            });
        });
    }, [])

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const nowDate = new Date();
            const data = {
                //DM_ID: ...
                Content: newMessage,
                Sender: username,
                Date: nowDate
            }

            // 메시지를 전송하고 messages 배열에 추가
            socketIO.emit("sendMessage", data);
            setMessages([...messages, { text: data.Content, sender: data.Sender, date: data.Date }]);

            // 해당 메세지 데이터베이스에 추가
            axios.post("http://localhost:4000/dmPage/api/sendDM", data).then();

            // 메시지 전송 후 입력 필드 비우기
            setNewMessage('');
        }
    };

    const deleteMessage = (index, date) => {
        const updatedMessages = [...messages];
        const data = {
            sender: username,
            index: index
        }

        // DM을 하고 있는 대상에게도 제거
        socketIO.emit("deleteMessage", data);

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