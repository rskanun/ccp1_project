import React from 'react';

// javascript
import Chat from "./TestChat";
import ChatRoomList from "./TestChatRoomList";

// css
import "./TestDM.css";


const TestDM = ({loginID}) => {
    return(
        <div className="container">
            <ChatRoomList/>
            <Chat username={loginID}/>
        </div>
    )
}
export default TestDM;