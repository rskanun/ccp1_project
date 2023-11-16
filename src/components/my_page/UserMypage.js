import React from 'react'

import UserInfoPage from './UserInfoPage';

const UserMypage = ({id}) => {
    return(
        <div style={{textAlign:"center"}}>
            <div className="container">
                <br></br>
                <h1>마이페이지</h1>
                <br></br>
                <p>현재 접속중인 계정 : ({id})</p>
                <br></br><hr></hr>
                <br></br>
                <UserInfoPage/>
                
                <br></br><br></br><br></br>
            </div>
        </div>
    )
}

export default UserMypage;