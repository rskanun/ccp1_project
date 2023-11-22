import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function UserProfile({ profileInfo, isProfileUser }) {
    const [isEditMode, setEditMode] = useState(false);
    const [introduction, setIntroduction] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!introduction || introduction === '') {
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
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className="userProfileBox">
            <div className="profliePic">

                {profilePic && <img src={profilePic} alt="Profile" />}
                {isProfileUser && !profilePic &&
                    <>
                        <button className="putPic" onClick={handlePutPicClick}>
                            -
                        </button>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </>
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