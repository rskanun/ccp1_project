import Chat from "./TestChat";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
// css
import "./TestDM.css";


const TestDM = () => {
    const [messages, setMessages] = useState([]);

    // 데이터베이스에서 메세지 가져오기
    useEffect(() => {
        const loadDM = async () => {
            const loadData = await axios.get("http://localhost:4000/dmPage/api/DMdata");
            setMessages(loadData.data);
        }

        loadDM().then();
    }, [])

    return(
        <div className="container">
            <Chat 
            username={"user1"}
            messages={messages}
            setMessages={setMessages}
            />

            <Chat 
            username={"user2"}
            messages={messages}
            setMessages={setMessages}
            />
        </div>
    )
}
export default TestDM;