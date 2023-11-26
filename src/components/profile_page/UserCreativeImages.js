import React, { useState, useEffect } from "react";
import axios from "axios";

function UserCreativeImages({ profileUser, isProfileUser, images, setImages, setIsModalOpen, setSelectedImageIndex }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageButtonSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PROFILE_API_URL}/getUserCreativeImages`, {
          params: {
            id: profileUser,
            page: currentPage
          }
        });

        const imgList = await Promise
          .all(response.data.imgs.map(async (data) => {

            return ({
              pk: data.pk,
              category: (data.category === 'other') ? data.otherCategory : categoryToStr(data.category),
              img: `data:${data.img.contentType};base64,${data.img.imageBase64}`
            });
          }))

        setImages(imgList);
        setTotalPages(response.data.totalPages);
      } catch (e) {
        if (e.response.status !== 404) {
          console.error(e);
        }
      }
    }

    if (profileUser && profileUser.id !== '') {
      fetchData();
    }
  }, [profileUser, currentPage])

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteImg = async (imageId) => {
    const userConfirmed = window.confirm("이미지를 삭제하시겠습니까?");
  
    if (userConfirmed) {
      const response = await axios.delete(`${process.env.REACT_APP_PROFILE_API_URL}/delCreativeImage`, {
        params: { imageId }
      });

      alert("이미지 삭제를 완료했습니다");
      window.location.reload();
    }
  };

  const openImageUploadForm = () => {
    const uploadFormUrl = './profile/uploadImage';
    const uploadFormWindow = window.open(uploadFormUrl, '_blank', 'width=600, height=400');

    uploadFormWindow.addEventListener('beforeunload', () => {
      window.location.reload();
    });
  };

  return (
    <div
      className={`userImgBox${!images || images.length === 0 ? " nullImages" : ""
        }`}
    >
      <div className="userImgText">
        등록 이미지 목록
        {isProfileUser &&
          <button className="userImgDeleteBtn" onClick={openImageUploadForm}>add</button>
        }
      </div>
      {images.map((image, index) => (
        <div
          className="userImgList"
          key={index}
        >
          <button className="imgDeleteBtn" onClick={() => handleDeleteImg(image.pk)}>ㅡ</button>
          <div className="userImgInProfile">
            <img
              src={image.img}
              alt={`Image ${index}`}
              onClick={() => {
                setSelectedImageIndex(index);
                setIsModalOpen(true);
              }} />
          </div>
          <div className="userImgCat">#{image.category}</div>
        </div>
      ))}

      {/* 게시글이 없는 경우 */}
      {(!images || images.length === 0) && (
        <p className="nullPost">아직 작성된 이미지가 없습니다!</p>
      )}

      <div className="btnListDiv">
        <button
          className="profilePageBtn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          〈
        </button>
        {Array.from({ length: Math.min(totalPages - parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize, pageButtonSize) }, (_, index) => {
          const firstPage = parseInt(((currentPage - 1) / pageButtonSize)) * pageButtonSize + 1;
          const pageNumber = firstPage + index;

          return (
            <button
              key={pageNumber}
              className="profilePageBtn numberBtn"
              disabled={currentPage === pageNumber}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className="profilePageBtn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || images.length <= 0}
        >
          〉
        </button>
      </div>
    </div>
  );
}

const categoryToStr = (category) => {
  switch (category) {
    case "draw":
      return "그림/일러";

    case "program":
      return "코딩";

    case "music":
      return "음악/작곡";

    case "goods":
      return "물품";

    case "video":
      return "영상";

    default:
      return category;
  }
}

export default UserCreativeImages;