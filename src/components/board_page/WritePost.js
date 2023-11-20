import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function WritePost() {
  const [id, setID] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['loginID']);
  const navigate = useNavigate();

  useEffect(() => {
      // 로그인 체크
      const userCheck = async () => {
          const token = cookies.loginID;
          try {
              const res = await axios.post(`${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`, {token: token});
              const id = res.data.id;

              setID(id);
          } catch (e) {
              removeCookie('loginID', { path: '/' }); // 쿠키 삭제
              navigate('/login'); // 로그인 페이지 이동
          }
      }

      userCheck();
  }, [cookies.loginID]);

  return id ? (<PostingPage id={id}/>) : null;
}

const PostingPage = ({id}) => {
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState(""); // 추가 입력 필드 값
  const [projectDetails, setProjectDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 폼 제출을 처리하는 로직 추가 (예: 서버로 데이터 전송)

    // 제출 후 폼 필드 초기화
    setProjectName("");
    setCategory("");
    setOtherCategory("");
  };

  return (
    <div>
      <h2>글 작성하기</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName">
          <Form.Label>프로젝트 이름 (필수)</Form.Label>
          <Form.Control
            type="text"
            placeholder="프로젝트 이름을 입력하세요."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="category">
          <Form.Label>분류</Form.Label>
          <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="그림/일러스트">그림/일러스트</option>
            <option value="코딩">코딩</option>
            <option value="음악/작곡">음악/작곡</option>
            <option value="물품">물품</option>
            <option value="영상">영상</option>
            <option value="기타">기타</option>
          </Form.Control>
        </Form.Group>
        
        {/* '기타'를 선택한 경우에만 추가 입력 필드가 나타남 */}
        {category === "기타" && (
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

        <Form.Group controlId="projectDetails">
          <Form.Label>프로젝트 세부 사항</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="프로젝트에 대한 세부 정보를 입력하세요."
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          작성 완료
        </Button>
        <Button variant="secondary" href="/board/list">
          뒤로 가기
        </Button>
      </Form>
    </div>
  );
};

export default WritePost;