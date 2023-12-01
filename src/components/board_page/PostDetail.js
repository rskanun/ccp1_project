import axios from 'axios';
import { useCookies } from "react-cookie";
import { Editor, EditorState, ContentState, convertFromRaw } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { socketIO } from '../../Socket';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./PostDetail.css";

function PostDetail() {
    const [id, setID] = useState("");
    const [cookies] = useCookies(["loginID"]);
    const [postID, setPostID] = useState("");

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
                    { token: token }
                );
                const userID = res.data.id;

                setID(userID);
            } catch (e) {
                setID("");
            }
        };
        const fetchData = async () => {
            await userCheck();
            const urlParams = new URLSearchParams(window.location.search);
            const postID = urlParams.get('_id');
            setPostID(postID);
        };

        fetchData();
    }, [cookies.loginID]);

    return postID ?
        <PostDetailPage
            loginID={id}
            postID={postID}
        />
        : null;
}

function PostDetailPage({ loginID, postID }) {
    const [showApplicants, setShowApplicants] = useState(false);
    const [userPermission, setUserPermission] = useState("");
    const [postInfo, setPostInfo] = useState({});
    const [reqInfo, setReqInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = (loginID !== "")
                    ? await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserInfo`, { params: { id: loginID } })
                    : { data: { Permission_Level: 0 } };

                const [postResponse, reqResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getPost`, { params: { pk: postID } }),
                    axios.get(`${process.env.REACT_APP_REQUEST_API_URL}/getRequest`, { params: { postID: postID } })
                ]);

                const rawContent = postResponse.data.Content;
                const contentState = rawContent ? convertFromRaw(rawContent) : ContentState.createFromText('');
                const contentEditorState = EditorState.createWithContent(contentState || ContentState.createFromText(''));

                const post = {
                    title: postResponse.data.Title,
                    category: postResponse.data.Category,
                    userID: postResponse.data.Register_Id,
                    nickname: postResponse.data.Register_Nickname,
                    date: postResponse.data.Register_Date,
                    content: contentEditorState
                };

                const applicants = await Promise
                    .all(reqResponse.data.Applicants.map(async (applicant) => {
                        const response = await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserInfo`, {
                            params: {
                                id: applicant
                            }
                        });

                        return {
                            id: applicant,
                            nickname: response.data.Nickname
                        }
                    }))

                const req = {
                    status: reqResponse.data.Status,
                    receiver: reqResponse.data.Receiver,
                    applicants: applicants
                };

                setPostInfo(post);
                setReqInfo(req);

                const permissionLevel = userResponse.data.Permission_Level;

                if (permissionLevel >= 2) {
                    setUserPermission("admin");
                } else if (post.userID === loginID) {
                    setUserPermission("writer");
                } else if (req.receiver === loginID) {
                    setUserPermission("receiver");
                } else if (req.applicants.some(applicant => applicant.id === loginID)) {
                    setUserPermission("applicant");
                } else if (permissionLevel === 1) {
                    setUserPermission("creator");
                } else {
                    setUserPermission("person");
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();
    }, [loginID]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                const postResponse = await axios.delete(`${process.env.REACT_APP_BOARD_API_URL}/deletePosts`, {
                    params: { selectedPosts: [{ pk: postID }] }
                });

                const reqResponse = await axios.delete(`${process.env.REACT_APP_REQUEST_API_URL}/delRequests`, {
                    params: { selectedPosts: [{ pk: postID }] }
                });

                if (postResponse.status === 200 && reqResponse.status === 200) {
                    alert("게시판 삭제가 완료되었습니다.");
                    window.location.href = `/board/list?category=${postInfo.category}`;
                }
            } catch (error) {
                // 에러 처리
                console.error(error);
            }
        }
    };

    const handleReport = async () => {
        const reportUrl = './report?user=' + postInfo.userID + "&post=" + postID;
        window.open(reportUrl, '_blank', 'width=600, height=400');
    }

    const handleRequest = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_API_URL}/receiverApplication`, {
                applicantID: loginID,
                postID: postID
            })

            if (response.status === 200) {
                alert("의뢰 신청이 완료되었습니다!");
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleWithdraw = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_REQUEST_API_URL}/receiverWithdraw`, {
                applicantID: loginID,
                postID: postID
            })

            if (response.status === 200) {
                alert("의뢰 신청이 철회되었습니다!");
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleComplete = async () => {
        const confirmComplete = window.confirm("정말로 의뢰를 완료하시겠습니까?");
        if (confirmComplete) {
            try {
                const response = await axios.patch(`${process.env.REACT_APP_REQUEST_API_URL}/patchStatus`, {
                    postID: postID,
                    status: "의뢰 완료"
                })

                if (response.status === 200) {
                    alert("의뢰가 완료됐습니다!");
                    window.location.reload();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const toggleApplicants = () => {
        setShowApplicants(!showApplicants);
    };

    return (
        <div className="post-detail">
            {/* Applicants Modal */}
            {showApplicants &&
                <ApplicantsList
                    toggleApplicants={toggleApplicants}
                    reqInfo={reqInfo}
                    loginID={loginID}
                    postID={postID}
                />
            }
            <div className="post-content">
                <div className="post-header">
                    <div className='post-info'>
                        <h1 className="post-title">[{reqInfo.status}] {postInfo.title}</h1>
                        <div className="author-date-container">
                            <span className="author" onClick={() => window.location.href = '/profile?user=' + postInfo.nickname}>{postInfo.nickname}</span>
                            <span className="date">{dateToStr(postInfo.date)}</span>
                        </div>
                    </div>
                    <div className="actions-container">
                        {((userPermission === "writer") || (userPermission === "admin")) &&
                            <button className='post-delete-btn' onClick={handleDelete}>삭제</button>}
                        {(userPermission !== "writer" && userPermission !== "admin") &&
                            <button onClick={handleReport}>신고</button>}
                        {(userPermission === "writer") && (reqInfo.status === "모집 중") &&
                            <button onClick={toggleApplicants}>의뢰자 목록</button>}
                        {(userPermission === "creator") && (reqInfo.status === "모집 중") &&
                            <button onClick={handleRequest}>의뢰 신청</button>}
                        {(userPermission === "applicant") && (reqInfo.status === "모집 중") &&
                            <button onClick={handleWithdraw}>의뢰 철회</button>}
                        {(userPermission === "writer") && (reqInfo.status === "모집 완료") &&
                            <button onClick={handleComplete}>의뢰 완료</button>}
                    </div>
                </div>

                <div className="post-body" style={{ display: 'flex' }}>
                    <Editor
                        editorState={postInfo.content || EditorState.createEmpty()} // Check if postInfo.content is defined
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    );
}

function ApplicantsList({ toggleApplicants, reqInfo, loginID, postID }) {
    const handleAccept = async (applicantID) => {
        const confirmAccept = window.confirm("정말로 해당 제작자로 확정하시겠습니까?");
        if (confirmAccept) {
            try {
                const reqResponse = await axios.patch(`${process.env.REACT_APP_REQUEST_API_URL}/acceptApplicant`, {
                    applicantID,
                    postID: postID
                });
                                
                const myID = loginID;
                const targetID = applicantID;
                const myDmId = await findDM({senderID: myID, receiverID: targetID});
                const targetDmId = await findDM({senderID: targetID, receiverID: myID});

                const dmID = await createDM({myDmId, targetDmId, myID, targetID})
                if (reqResponse.status === 200) {
                    const content = "제작자 님께서 해당 의뢰의 제작자로 확정되었음을 알려드립니다!\n"
                        + "해당 의뢰 링크: " + window.location.href;
                    const data = {
                        DM_ID: dmID,
                        Content: content,
                        Sender: loginID,
                        Date: new Date()
                    }

                    const sendResponse = await axios.post(`${process.env.REACT_APP_DM_API_URL}/sendDM`, data);

                    if (sendResponse.status === 200) {
                        // 메시지를 전송하고 messages 배열에 추가
                        socketIO.emit("sendMessage", {
                            ...data,
                            Receiver: targetID
                        });

                        alert("제작자 확정을 완료했습니다!");
                        window.location.reload();
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const createDM = async ({myDmId, targetDmId, myID, targetID}) => {
        try {
            if(!myDmId && !targetDmId) {
                const createMyDM = await axios.post(`${process.env.REACT_APP_DM_API_URL}/addDM`, {
                    senderID: myID,
                    receiverID: targetID
                });

                const createTargetDM = await axios.post(`${process.env.REACT_APP_DM_API_URL}/addDM`, {
                    senderID: targetID,
                    receiverID: myID,
                    dmID: createMyDM.data
                });

                return createMyDM.data;
            }
            else if(!myDmId) {
                const createMyDM = await axios.post(`${process.env.REACT_APP_DM_API_URL}/addDM`, {
                    senderID: myID,
                    receiverID: targetID,
                    dmID: targetDmId
                });

                return targetDmId;
            }
            else if(!targetDmId) {
                const createTargetDM = await axios.post(`${process.env.REACT_APP_DM_API_URL}/addDM`, {
                    senderID: targetID,
                    receiverID: myID,
                    dmID: myDmId
                });

                return myDmId;
            } else 
                return myDmId;
        } catch (e) {
            console.error(e);
        }
    }

    const findDM = async ({ senderID, receiverID}) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_DM_API_URL}/getDM`, {
                params: { senderID, receiverID }
            });

            return response.data.DM_ID;
        } catch (e) {
            if(e.response.status === 404) {
                console.error(e);
                return null;
            }
        }
    }

    return (
        <div className="applicants-modal">
            <div className='applicants-container'>
                <button className='applicant-close-btn' onClick={toggleApplicants}>×</button>
                <div className="applicants-header">
                    <span>의뢰자 신청 목록</span>
                </div>
                <div className="applicants-list">
                    {reqInfo.applicants.map((applicant, index) => (
                        <div className='applicant-container' key={index}>
                            <li className='applicant-nickname'><a href={'/profile?user=' + applicant.id}>{applicant.nickname}</a></li>
                            <div className='applicant-btn-container'>
                                <button className='applicant-accept' onClick={() => handleAccept(applicant.id)}>수락</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const dateToStr = (date) => {
    const formattedDate = new Date(date).toLocaleDateString()
        + " "
        + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

    return formattedDate;
}

export default PostDetail;