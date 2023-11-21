import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import './BoardPage.css'

function BoardList() {
    const [boardList, setBoardList] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedPosts, setSelectedPosts] = useState([]);
    const navigation = useNavigate();

    // 게시판 목록 가져오기
    useEffect(() => {
        const loadBoardList = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const getCategory = urlParams.get('category');
            const list = await axios.get(`${process.env.REACT_APP_BOARD_API_URL}/getPostList`, {
                params: {
                    type: getCategory
                }
            });

            setBoardList(list.data);
            setCategory(getCategory);
        }

        loadBoardList().then();
    }, [setCategory]);

    const handleDelete = async () => {
        if (selectedPosts.length === 0) {
            alert("삭제할 게시글을 선택하세요.");
            return;
        }

        // 서버로 선택된 항목 삭제 요청
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BOARD_API_URL}/deletePosts`, {
                params: {selectedPosts}
            });

            if (response.status === 200) {
                // 서버에서 성공적으로 삭제되면 클라이언트에서도 제거
                const updatedBoardList = boardList.filter(
                    board => !selectedPosts.some(
                        selectedBoard => selectedBoard.pk === board._id));
                setBoardList(updatedBoardList);
                setSelectedPosts([]); // 선택 항목 초기화

                alert("게시판 삭제가 완료되었습니다.");
            }
        } catch (error) {
            // 에러 처리
            console.error(error);
        }
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {boardList.map((board, index) => (
                        <Board
                            key={index}
                            id={index}
                            board={board}
                            setSelectedPosts={setSelectedPosts}
                            selectedPosts={selectedPosts}
                        />
                    ))}
                </tbody>
            </Table>
            <a href ={`/board/write?category=${category}`}>
                <Button variant="info">글쓰기</Button>
            </a>
            <Button variant="danger" onClick={handleDelete}>삭제하기</Button>
        </div>
    );
}

function Board({ id, board, setSelectedPosts, selectedPosts }) {
    const onCheckboxChange = ({ checked, id, boardPK }) => {
        if (checked) {
            // checkbox가 선택되었을 때
            const board = {id: id, pk: boardPK};
            setSelectedPosts([...selectedPosts, board]);
        } else {
            // checkbox가 해제되었을 때
            setSelectedPosts(selectedPosts.filter(board => board.id !== id));
        }
    };

    const setDateInfo = ({date}) => {
        const nowDate = new Date();

        // 날짜를 비교하여 "시-분" 또는 "년-월-일"로 변환
        const formattedDate = nowDate.toDateString() === new Date(date).toDateString()
            ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            : new Date(date).toLocaleDateString();

        return formattedDate;
    }

    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    value={id}
                    onChange={(e) => {
                        onCheckboxChange({
                            checked: e.target.checked, 
                            id: e.target.value,
                            boardPK: board._id
                        });
                    }}
                />
            </td>
            <td>{id}</td>
            <td>{board.Title}</td>
            <td>{board.Register_Nickname}</td>
            <td>{setDateInfo({date: board.Register_Date})}</td>
        </tr>
    );
}

export default BoardList;
