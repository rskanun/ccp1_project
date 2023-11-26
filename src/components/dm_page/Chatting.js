import React, { useState, useEffect, useRef } from 'react';
import { socketIO } from '../../Socket';
import axios from 'axios';

function Chatting({ loginID, selectedDmIndex, dmList, setDmList, selectedDM, setSelectedDM, userList }) {
    // 메시지를 전송하는 함수
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // 나가기 버튼 활성화 함수
    const [exitConfirm, setExitConfirm] = useState(false);

    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            const nowDate = new Date();
            const data = {
                DM_ID: selectedDM.id,
                Content: newMessage,
                Sender: loginID,
                Date: nowDate
            }
    
            // 메시지 전송 후 입력 필드 비우기
            setMessages([...messages, { text: newMessage, sender: loginID, date: nowDate }]);
            setNewMessage('');
    
            // 해당 메세지 데이터베이스에 추가
            await axios.post(`${process.env.REACT_APP_DM_API_URL}/sendDM`, data)
                .then(() => {
                    // 사용자 목록을 순회하며 메세지 전송
                    for (const receiver of userList) {
                        // 자신을 제외한 DM 안에 있는 사람들에게 메세지 전달
                        if (receiver !== loginID) {
                            const socketSendData = {
                            ...data,
                            Receiver: receiver
                        }
                            // 메시지를 전송하고 messages 배열에 추가
                            socketIO.emit("sendMessage", socketSendData);
                        }
                    }
                });
    
            
        }
    };

    const deleteMessage = async (index, date) => {
        const updatedMessages = [...messages];
        const data = {
            sender: loginID,
            index: index
        }

        // messages 배열에서 제거하여 UI 상에서 삭제
        updatedMessages.splice(index, 1);
        setMessages(updatedMessages);
        
        // 해당 메시지를 데이터베이스 상에서 제거
        await axios.delete(`${process.env.REACT_APP_DM_API_URL}/deleteDM`, {
            params: {
                sender: loginID,
                date: date
            }
        }).then(
            // DM을 하고 있는 대상에게도 제거
            userList.forEach((receiver) => {
                // 자신을 제외한 DM 안에 있는 사람들에게 메세지 삭제
                if(receiver !== loginID) {
                    const socketSendData = {
                        ...data,
                        Receiver: receiver
                    }
                
                    socketIO.emit("deleteMessage", socketSendData);
                }
        }));
    };

    const handleLeaveChat = async () => {
        const updateDmList = [...dmList];

        // 해당 DM을 데이터베이스 상에서 제거
        await axios.delete(`${process.env.REACT_APP_DM_API_URL}/exitDM`, {
            params: {
                dmID: selectedDM.id,
                userID: loginID
            }
        }).then(() => {
            // UI 상에서 dm 제거
            updateDmList.splice(selectedDmIndex, 1);
            setDmList(updateDmList);
            setSelectedDM(null);
        })

        setExitConfirm(false);
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            sendMessage();
        }
    }

    return selectedDM ? (
        <div className='dm_chat'>
            <button className='dm_exit' onClick={() => setExitConfirm(true)}>X</button>
            {exitConfirm ? 
                <div className='ask_exit'>정말로 나가시겠습니까?<br />
                    <button className='dm_exit_check' onClick={handleLeaveChat}>O</button>
                    <button className='dm_exit_refuse' onClick={() => setExitConfirm(false)}>X</button>
                </div> : null}
            <MessageList 
                selectedDM={selectedDM}
                messages={messages}
                setMessages={setMessages}
                deleteMessage={deleteMessage}
                loginID={loginID}
            />
            <div className='dm_inputTextBox'>
                <input 
                    className='dm_inputText' 
                    type="text"
                    placeholder='내용 입력...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className='dm_inputText_enter' onClick={sendMessage}>입력</button>
            </div>
        </div>
    ) : <div className='dm_chat' />;
}

function MessageList({ selectedDM, messages, setMessages, deleteMessage, loginID }) {
    const dmContentRef = useRef(null);
    const shouldScrollToBottom = useRef(true);
    
    useEffect(() => {
        // 새 DM이 도착했을 경우 실시간 업데이트
        socketIO.on("newMessage", async (msg) => {
            if(selectedDM.isReading === false) {
                await axios.post(`${process.env.REACT_APP_DM_API_URL}/readingDM`, {
                    params: {
                        dmID: selectedDM.id,
                        userID: loginID
                    }
                })
            }
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
    
    useEffect(() => {
        // 데이터베이스에서 메세지 가져오기
        const loadDM = async () => {
            await axios.get(`${process.env.REACT_APP_DM_API_URL}/DMdata`, {
                params: {
                    dmID: selectedDM.id
                }
            }).then((res) => {
                setMessages(res.data);
            });
        }

        if (selectedDM) {
            loadDM();
        }
    }, [selectedDM])

    const handleScroll = () => {
        const contentRef = dmContentRef.current;

        if (contentRef) {
            const isScrolledToBottom = contentRef.scrollHeight - contentRef.clientHeight <= contentRef.scrollTop + 1;
            shouldScrollToBottom.current = isScrolledToBottom;
        }
    };

    return (
        <div className='dm_whole_content'>
            <div className='dm_content' ref={dmContentRef} onScroll={handleScroll}>
                {messages.map((message, index) => (
                    <span key={index} className={`${message.sender === loginID ? 'self_message' : 'other_user_message'}`}>
                        <button className='delete_sender_bubble' onClick={() => deleteMessage(index, message.date)}>X</button>
                        {message.text}
                    </span>
                ))}
                <UpdateScroll 
                    dmContentRef={dmContentRef} 
                    messages={messages}
                    shouldScrollToBottom={shouldScrollToBottom}
                />
            </div>
        </div>
    );
}

const UpdateScroll = ({ dmContentRef, shouldScrollToBottom, messages }) => {
    useEffect(() => {
        const contentRef = dmContentRef.current;

        if (contentRef) {
            const isScrolledToBottom = contentRef.scrollHeight - contentRef.clientHeight <= contentRef.scrollTop + 1;

            if (shouldScrollToBottom.current && !isScrolledToBottom) {
                contentRef.scrollTop = contentRef.scrollHeight;
            } else if (!shouldScrollToBottom.current && isScrolledToBottom) {
                shouldScrollToBottom.current = true;
            }
        }
    }, [messages]);

    return null;
}

export default Chatting;