import React, { useEffect } from "react";
import axios from 'axios';

function ChatList({ loginID, dmList, selectedDM, setSelectedDM, setSelectedDmIndex, setUserList }) {
    useEffect(() => {
        const loadUserList = async () => {
            const list = await axios.get(`${process.env.REACT_APP_DM_API_URL}/getUserList`, {
                params: {
                    dmID: selectedDM.id
                }
            });
            setUserList(list.data);
        }

        if(selectedDM) {
            loadUserList().then();
        }
    }, [setSelectedDM]);

    const handleDmClick = async (index, dm) => {
        if(dm.isReading === false) {
            await axios.patch(`${process.env.REACT_APP_DM_API_URL}/readingDM`, {
                dmID: dm.id,
                userID: loginID
            }).then(() => {
                setSelectedDM(dm);
                setSelectedDmIndex(index);
            });
        }
        else {
            setSelectedDM(dm);
            setSelectedDmIndex(index);
        }
    };

    return(
        <div className='dm_list'>
            {dmList.map((dm, index) => (
                <div
                    key={index}
                    className={(selectedDM && dm.id === selectedDM.id) ? 'dm_opponent_talking' : 'dm_opponent'}
                    onClick={() => handleDmClick(index, dm)}>
                    <div className='profile'>{}</div>
                    <span className='user_name'>{dm.name}</span>
                    <div className='not_check_message'>{dm.isReading ? "" : "!"}</div>
                </div>
            ))}
        </div>
    );
}

export default ChatList;