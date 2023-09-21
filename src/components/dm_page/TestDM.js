import Chat from "./TestChat";

import "./TestDM.css";

import React, { useState } from 'react';

const TestDM = () => {
    const [messages, setMessages] = useState([]);


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