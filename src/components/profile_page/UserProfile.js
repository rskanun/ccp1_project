import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function UserProfile({ profileInfo, isProfileUser }) {
    const [isEditMode, setEditMode] = useState(false);
    const [introduction, setIntroduction] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (profileInfo && profileInfo.id && profileInfo.introduction) {
            const getProfileImage = async (id) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_PROFILE_API_URL}/getProfileImage/`, {
                        params: {
                            userID: id
                        }
                    });

                    if (response.data && response.data.imageBase64) {
                        setProfilePic(`data:${response.data.contentType};base64,${response.data.imageBase64}`);
                    } else {
                        console.error('Failed to fetch profile image:', response.statusText);
                    }
                } catch (e) {
                    if(e.response.status !== 404) {
                        console.error(e);
                    }
                }
            }

            getProfileImage(profileInfo.id);
            setIntroduction(profileInfo.introduction);
        }
    }, [profileInfo])

    const handleEditClick = async () => {
        if (isEditMode) {
            await axios.patch(`${process.env.REACT_APP_PROFILE_API_URL}/updateIntro`, {
                id: profileInfo.id,
                introduction
            }).then(() => {
                setEditMode(false);
            })
        }
        else
            setEditMode(true);
    }

    const handlePutPicClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                handleProfilePicUpload(selectedFile);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleProfilePicUpload = async (imgData) => {
        try {
            // 이미지를 업로드할 때 사용할 FormData 생성
            const formData = new FormData();
            formData.append('img', imgData);
            formData.append('userID', profileInfo.id);

            // 이미지를 서버로 업로드
            await axios.post(`${process.env.REACT_APP_PROFILE_API_URL}/uploadProfileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        } catch (e) {
            console.error(e.data);
        }
    };

    return (
        <div className="userProfileBox">
            <div className="profilePicContainer">
                {profilePic && <img className="profilePic" src={profilePic} alt="Profile" />}
                {isProfileUser &&
                    <div className="picContainer">
                        <button className={`putPic ${profilePic ? 'isHide' : ''}`} onClick={handlePutPicClick}>
                            +
                        </button>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                }
            </div>
            <div className="proflieIntro">
                <div className="userNameBox">
                    <span className="nameText">Name</span>
                    <div className="userNameText">{profileInfo.nickname}</div>
                </div>
                {!isProfileUser && <button className="DMWithUserBtn">DM+</button>}
                <div className="userIntroBox">
                    <span className="introText">[자기소개]</span>
                    {isProfileUser &&
                        <button className="writeInterBtn" onClick={handleEditClick}>
                            +
                        </button>}
                    {isEditMode ? (
                        <input
                            className="userIntroEdit"
                            defaultValue={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                        />
                    ) : (
                        <div className="userIntroText">{introduction}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default UserProfile;