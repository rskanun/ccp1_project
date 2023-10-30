import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useLocation } from "react-router-dom";

function BoardWrite() {
    const [user, setUser] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
                const id = res.data.id;

                const userInfo = await axios.get(`${process.env.REACT_APP_USER_API_URL}/getUserInfo`, {userID:id});
                const nickname = userInfo.data.Nickname;

                setUser({id, nickname});
            } catch (e) {
                removeCookie('loginID'); // 쿠키 삭제
                navigate('/login'); // 로그인 페이지 이동
            }
        }

        userCheck();
    }, []);

    return (user.id && user.nickname) ? 
        (<PostingPage user={user}/>)
        : null;
}

function PostingPage({user}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const handlePosting = async () => {
        const boardType = new URLSearchParams(location.search).get('boardType')
        await axios.post(`${process.env.REACT_APP_BOARD_API_URL}/posting`, {
            boardType,
            title,
            content,
            id: user.id,
            nickname: user.nickname
        }).then(() => {
            setTitle("");
            setContent("");

            navigate('/board/list');
        }).catch((e) => {
            console.error(e);
        });
    };

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                    />
                </Form.Group>
            </Form>
            <Button variant="info" onClick={handlePosting}>
                작성완료
            </Button>
            <a to="/board/list">
                <Button variant="secondary">
                    취소
                </Button>
            </a>
        </div>
    );
}

export default BoardWrite;
