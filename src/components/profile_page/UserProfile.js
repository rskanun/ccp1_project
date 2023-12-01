import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function UserProfile({ profileInfo, isProfileUser, loginID }) {
  const [isEditMode, setEditMode] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profileInfo && profileInfo.id && profileInfo.introduction) {
      const getProfileImage = async (id) => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_PROFILE_API_URL}/getProfileImage/`,
            {
              params: {
                userID: id,
              },
            }
          );

          if (response.data && response.data.imageBase64) {
            setProfilePic(
              `data:${response.data.contentType};base64,${response.data.imageBase64}`
            );
          } else {
            console.error(
              "Failed to fetch profile image:",
              response.statusText
            );
          }
        } catch (e) {
          if (e.response.status !== 404) {
            console.error(e);
          }
        }
      };

      getProfileImage(profileInfo.id);
      setIntroduction(profileInfo.introduction);
    }
  }, [profileInfo]);

  const handleEditClick = async () => {
    if (isEditMode) {
      await axios
        .patch(`${process.env.REACT_APP_PROFILE_API_URL}/updateIntro`, {
          id: profileInfo.id,
          introduction,
        })
        .then(() => {
          setEditMode(false);
        });
    } else setEditMode(true);
  };

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
      formData.append("img", imgData);
      formData.append("userID", profileInfo.id);

      // 이미지를 서버로 업로드
      await axios.post(
        `${process.env.REACT_APP_PROFILE_API_URL}/uploadProfileImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (e) {
      console.error(e.data);
    }
  };

  const handleAddDM = async () => {
    try {
      const myID = loginID;
      const targetID = profileInfo.id;
      const myDmId = await findDM({ senderID: myID, receiverID: targetID });
      const targetDmId = await findDM({ senderID: targetID, receiverID: myID });

      await createDM({ myDmId, targetDmId, myID, targetID });

      window.location.href = "/DM";
    } catch (e) {
      console.error(e);
    }
  };

  const createDM = async ({ myDmId, targetDmId, myID, targetID }) => {
    try {
      if (!myDmId && !targetDmId) {
        const createMyDM = await axios.post(
          `${process.env.REACT_APP_DM_API_URL}/addDM`,
          {
            senderID: myID,
            receiverID: targetID,
          }
        );

        const createTargetDM = await axios.post(
          `${process.env.REACT_APP_DM_API_URL}/addDM`,
          {
            senderID: targetID,
            receiverID: myID,
            dmID: createMyDM.data,
          }
        );

        return createMyDM.data;
      } else if (!myDmId) {
        const createMyDM = await axios.post(
          `${process.env.REACT_APP_DM_API_URL}/addDM`,
          {
            senderID: myID,
            receiverID: targetID,
            dmID: targetDmId,
          }
        );

        return targetDmId;
      } else if (!targetDmId) {
        const createTargetDM = await axios.post(
          `${process.env.REACT_APP_DM_API_URL}/addDM`,
          {
            senderID: targetID,
            receiverID: myID,
            dmID: myDmId,
          }
        );

        return myDmId;
      } else return myDmId;
    } catch (e) {
      console.error(e);
    }
  };

  const findDM = async ({ senderID, receiverID }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DM_API_URL}/getDM`,
        {
          params: { senderID, receiverID },
        }
      );

      return response.data.DM_ID;
    } catch (e) {
      if (e.response.status === 404) {
        console.error(e);
        return null;
      }
    }
  };

  return (
    <div className="userProfileBox">
      <div className="profilePicContainer">
        {profilePic && (
          <img className="profilePic" src={profilePic} alt="Profile" />
        )}
        {isProfileUser && (
          <div className="picContainer">
            <button
              className={`putPic ${profilePic ? "isHide" : ""}`}
              onClick={handlePutPicClick}
            >
              +
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      <div className="proflieIntro">
        <div className="userNameBox">
          <span className="nameText">Name</span>
          <div className="userNameText">{profileInfo.nickname}</div>
        </div>
        {!isProfileUser && (
          <button className="DMWithUserBtn" onClick={handleAddDM}>
            DM+
          </button>
        )}
        <div className="userIntroBox">
          <span className="introText">[자기소개]</span>
          {isProfileUser && (
            <button className="writeInterBtn" onClick={handleEditClick}>
              +
            </button>
          )}
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
