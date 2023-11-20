import React from 'react'

const ManagerMypage = () => {
    return(
        <div style={{textAlign:"center"}}>
            <div className="container">
                <br></br>
                <h1>관리자 마이페이지</h1>
                <br></br>
                <p>현재 접속중인 계정 : "계정 id 혹은 닉네임"</p>
                <br></br><hr></hr>
                <br></br>
                <button style={{width:'200px'}} className='btn'>유저 정지</button>
                <button style={{width:'200px'}} className='btn'>신고 확인</button>
                <br></br><br></br><br></br>
            </div>
        </div>
    )
}

export default ManagerMypage;