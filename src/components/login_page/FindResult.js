import React from 'react';
import './FindResult.css';

function FindResult({ findAccData }) {
    const findType = findAccData.findType;
    const findData = findAccData.data;

    return (
        <div className='resultContainer'>
            {findType === "id" ? <FindID findID={findData} />
                : <FindPassword findPassword={findData} />}
        </div>
    )
}
export default FindResult;

function FindID({ findID }) {
    return findID ? (
        // 아이디를 찾은 경우
        <div className="resultWholeBox">
            <br/><br/>
            <div className="noticeIDText">
                <span>매칭되는 아이디를 찾았습니다!</span>
                <br />
                <div className="noticeID">
                <span style={{ fontWeight: 'bold' }}>{findID}</span>
                </div>
                <br />
                <br />
                <span>온전한 아이디는 메일을 통해 확인해주세요</span>
            </div>
        </div>
    ) : (
        // 아이디를 찾지 못한 경우
        <div className="resultWholeBox">
            <br/><br/>
            <div className="noticeFailText">
                <span style={{ fontWeight: 'bold' }}>매칭되는 아이디를 찾지 못했습니다.</span>
            </div>
            <br/><br/>
            <div className="noticeIDText2">
                <span>일치하는 아이디가 없습니다.</span>
            </div>
        </div>
    );
}

function FindPassword({ findPassword }) {
    return findPassword ? (
        // 비밀번호를 찾은 경우
        <div className="resultWholeBox">
            <br/><br/>
            <div className="noticePWText">
                <span>매칭되는 비밀번호를 찾았습니다!</span>
                <br />
                <div className="noticePW">
                <span style={{ fontWeight: 'bold' }}>{findPassword}</span>
                <br />
                <br />
                <span>온전한 비밀번호는 메일을 통해 확인해주세요</span>
            </div>
            </div>
        </div>
    ) : (
        // 비밀번호를 찾지 못한 경우
        <div className="resultWholeBox">
            <br/><br/>
            <div className="noticeFailText">
                <span style={{ fontWeight: 'bold' }}>매칭되는 비밀번호를 찾지 못했습니다.</span>
            </div>
            <br/><br/>
            <div className="noticeFailText2">
                <span>일치하는 비밀번호가 없습니다.</span>
            </div>
        </div>
    );
}