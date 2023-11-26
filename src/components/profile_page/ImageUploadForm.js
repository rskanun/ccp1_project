import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

import "./ImageUploadForm.css";

const ImageUploadForm = () => {
    const [category, setCategory] = useState("draw");
    const [otherCategory, setOtherCategory] = useState("");
    const [image, setImage] = useState(null);
    const [id, setID] = useState('');
    const [cookies] = useCookies(["loginID"]);

    useEffect(() => {
        // 로그인 체크
        const userCheck = async () => {
            const token = cookies.loginID;
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_LOGIN_API_URL}/loginCheck`,
                    { token: token }
                );

                setID(res.data.id);
            } catch (e) {
                alert("페이지 로딩 중 오류가 발생했습니다!\n", e);

                window.close();
            }
        };

        userCheck();
    }, [cookies.loginID])

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleOtherCategoryChange = (e) => {
        setOtherCategory(e.target.value);
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const handleUpload = async () => {
        try {
            // 이미지를 업로드할 때 사용할 FormData 생성
            const formData = new FormData();
            formData.append('img', image);
            formData.append('id', id);
            formData.append('category', category);
            formData.append('otherCategory', otherCategory);

            // 이미지를 서버로 업로드
            await axios.post(`${process.env.REACT_APP_PROFILE_API_URL}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            await checkPermission();
            
            window.close();
        } catch (e) {
            console.error(e);
        }
    };

    const checkPermission = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PROFILE_API_URL}/getUploadImgesCount`, {
                params: { id }
            });
            const count = response.data;

            if(count >= 3) {
                await axios.patch(`${process.env.REACT_APP_USER_API_URL}/rankUpToCreator`, { id })
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleGoBack = () => {
        window.close();
    }

    return (
        <div className="uploadWholePage">
            <div className="pinDeco"></div>
            <div className="uploadPageBox">
                <div className="selectCat">
                    <br />
                    <label className="categoryList">
                        <span className="catTextInUploader">카테고리</span>
                        <select value={category} onChange={handleCategoryChange}>
                            <option value="draw">그림/일러스트</option>
                            <option value="program">코딩</option>
                            <option value="music">음악/작곡</option>
                            <option value="goods">물품</option>
                            <option value="video">영상</option>
                            <option value="other">기타</option>
                        </select>
                    </label>
                    <br /><br />
                    {category === "other" && (
                        <label>
                            <span className="catTextInUploader">기타 카테고리 입력</span>
                            <input type="text" value={otherCategory} onChange={handleOtherCategoryChange} />
                        </label>
                    )}
                </div>

                <div className="selectUploadImg">
                    <label>
                        <span className="ImgTextInUploader">업로드할 작업물 이미지</span>
                        <input className="selectFileImgInput" type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
                <div className="uploaderBtnList">
                    <button 
                        className="uploaderDoBtn" 
                        disabled={image === null}
                        onClick={handleUpload}>올리기
                    </button>
                    <button className="uploaderBackBtn" onClick={handleGoBack}>돌아가기</button>
                </div>
            </div>
        </div>

    );
};

export default ImageUploadForm;