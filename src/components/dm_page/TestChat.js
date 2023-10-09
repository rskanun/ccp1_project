import React, { useState, useEffect } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';
// css
import "./TestChat.css";


function Chat({ username, selectedDM, userList }) {
    // 메시지를 전송하는 함수
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
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

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            const nowDate = new Date();
            const data = {
                DM_ID: selectedDM,
                Content: newMessage,
                Sender: username,
                Date: nowDate
            }
    
            // 메시지 전송 후 입력 필드 비우기
            setMessages([...messages, { text: newMessage, sender: username, date: nowDate }]);
            setNewMessage('');
    
            // 해당 메세지 데이터베이스에 추가
            console.log("1");
            await axios.post(`${process.env.REACT_APP_DM_API_URL}/sendDM`, data);
            console.log("2");
    
            // 사용자 목록을 순회하며 메세지 전송
            for (const receiver of userList) {
                // 자신을 제외한 DM 안에 있는 사람들에게 메세지 전달
                if (receiver !== username) {
                    const socketSendData = {
                        ...data,
                        Receiver: receiver
                    }
                    // 메시지를 전송하고 messages 배열에 추가
                    socketIO.emit("sendMessage", socketSendData);
                }
            }
        }
    };

    const deleteMessage = async (index, date) => {
        const updatedMessages = [...messages];
        const data = {
            sender: username,
            index: index
        }

        // messages 배열에서 제거하여 UI 상에서 삭제
        updatedMessages.splice(index, 1);
        setMessages(updatedMessages);
        
        // 해당 메시지를 데이터베이스 상에서 제거
        await axios.delete(`${process.env.REACT_APP_DM_API_URL}/deleteDM`, {
            params: {
                sender: username,
                date: date
            }
        }).then(
            // DM을 하고 있는 대상에게도 제거
            userList.forEach((receiver) => {
                // 자신을 제외한 DM 안에 있는 사람들에게 메세지 삭제
                if(receiver !== username) {
                    const socketSendData = {
                        ...data,
                        Receiver: receiver
                    }
                
                    socketIO.emit("deleteMessage", socketSendData);
                }
        }));
    };

    return selectedDM ? (
        <div className="chat-container">
            <MessageList
                selectedDM={selectedDM}
                messages={messages}
                setMessages={setMessages}
                deleteMessage={deleteMessage}
                username={username}
            />
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    ) : null;
}

function MessageList({ selectedDM, messages, setMessages, deleteMessage, username }) {
    useEffect(() => {
        // 데이터베이스에서 메세지 가져오기
        const loadDM = async () => {
            const loadData = await axios.get(`${process.env.REACT_APP_DM_API_URL}/DMdata`, {
                params: {
                    dmID: selectedDM
                }
            });
            setMessages(loadData.data);
        }

        if (selectedDM !== null) {
            loadDM();
        }
    }, [selectedDM])

    return(
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
    )
}

export default Chat;