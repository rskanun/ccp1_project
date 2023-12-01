import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./WritePost.css";


function WritePost() {
  const [id, setID] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["loginID"]);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 체크
    const userCheck = async () => {
      const token = cookies.loginID;
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
          { token: token }
        );
        const id = res.data.id;

        setID(id);
      } catch (e) {
        removeCookie("loginID", { path: "/" }); // 쿠키 삭제
        navigate("/login"); // 로그인 페이지 이동
      }
    };

    userCheck();
  }, [cookies.loginID]);

  return id ? <PostingPage id={id} /> : null;
}

const PostingPage = ({ id }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState(""); // 추가 입력 필드 값
  const [content, setContent] = useState(EditorState.createEmpty());
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const pageCategory = urlParams.get("category");

  useEffect(() => {
    if (category === "") {
      setCategory((pageCategory && pageCategory !== "") ? pageCategory : "draw");
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userInfo = await axios.get(
        `${process.env.REACT_APP_USER_API_URL}/getUserInfo`,
        {
          params: {
            id,
          },
        }
      );
      const nickname = userInfo.data.Nickname;
  
      // EditorState를 직렬화하여 MongoDB에 저장
      const contentRaw = convertToRaw(content.getCurrentContent());
  
      const postingResponse = await axios.post(`${process.env.REACT_APP_BOARD_API_URL}/posting`, {
        category: (category === 'all') ? "draw" : category,
        otherCategory,
        title,
        content: contentRaw, // 직렬화된 content를 저장
        id,
        nickname: nickname,
      });
  
      await axios.post(`${process.env.REACT_APP_REQUEST_API_URL}/addRequest`, {
        postID: postingResponse.data._id,
        client: id
      }).then(() => {
        setTitle("");
        setCategory("");
        setOtherCategory("");
        setContent(EditorState.createEmpty()); // 초기화
  
        navigate("/board/list?category=" + pageCategory);
      })
    } catch (e) {
      console.log(e);
      alert("게시글을 올리는 과정에서 오류가 발생했습니다!\n" + e);
    }
  };


  return (

    <div className="WritePostWholeBox">
      <h2>글 작성하기</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName" className="WriteProjectNameBox">
          <Form.Label>프로젝트 이름 (필수)</Form.Label>
          <Form.Control
            type="text"
            placeholder="프로젝트 이름을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="category" className="WriteProjectCatBox">
          <Form.Label>분류</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="draw">그림/일러스트</option>
            <option value="program">코딩</option>
            <option value="music">음악/작곡</option>
            <option value="goods">물품</option>
            <option value="video">영상</option>
            <option value="other">기타</option>
          </Form.Control>
        </Form.Group>

        {/* '기타'를 선택한 경우에만 추가 입력 필드가 나타남 */}
        {category === "other" && (
          <Form.Group controlId="otherCategory">
            <Form.Label>기타 카테고리 입력</Form.Label>
            <Form.Control
              type="text"
              placeholder="기타 카테고리를 입력하세요."
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Draft Editor 추가 */}
        <Form.Group controlId="projectDetails" className="WriteProjectDetailConbox">
          <Form.Label className="projectDetailText">프로젝트 세부 사항</Form.Label>
          <DraftEditor className="WriteProjectDetailbox"
            editorState={content}
            onEditorStateChange={newContent => setContent(newContent)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="registProgectBtn">
          작성 완료
        </Button>
        <Button className="stopProgectBtn"
          variant="secondary"
          href={"/board/list?category=" + pageCategory}
        >
          뒤로 가기
        </Button>

      </Form>
    </div>

  );

};


export default WritePost;