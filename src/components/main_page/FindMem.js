import axios from "axios";
import React, { useState } from "react";
import "./FindMem.css";

const FindUser = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  const handleSearch = async () => {
    try {
      const findMembers = await axios.get(
        `${process.env.REACT_APP_USER_API_URL}/findUsersInfo`,
        {
          params: {
            nickname: searchQuery,
          },
        }
      );

      setMembers(findMembers.data);
      setShowMembers(true);
    } catch (e) {
      setMembers([]);
    }
  };

  return (
    <div className="findMemberBarDiv">
      <h1>회원 검색</h1>
      <SearchBar
        className="writeMemToSearch"
        onSearch={setSearchQuery}
        onSearchButtonClick={handleSearch}
      />
      {showMembers && <MemberList members={members} />}
    </div>
  );
};

const SearchBar = ({ onSearch, onSearchButtonClick }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearchButtonClick();
    }
  };

  return (
    <div className="writeMemToSearchDiv">
      <input
        type="text"
        placeholder="유저를 검색하세요..."
        onChange={(e) => onSearch(e.target.value)}
        onKeyPress={handleKeyPress}
        className="writeMemToSearchBar"
      />
      <button className="writeMemToSearchBtn" onClick={onSearchButtonClick}>
        검색
      </button>
    </div>
  );
};

const MemberList = ({ members }) => {
  console.log(members);
  return (
    <ul className="searchedMemList">
      {members.map((member, index) => (
        <li className="searchedMember" key={index}>
          <a className="goToMemberProfile" href={"/profile?user=" + member.id}>
            {member.nickname}
          </a>
          <a
            className="goToMemberProfileFast"
            href={"/profile?user=" + member.id}
          >
            프로필 바로가기&rarr;
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FindUser;
