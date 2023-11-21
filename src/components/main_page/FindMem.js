import axios from 'axios';
import React, { useState } from 'react';

const FindUser = () => {
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMembers, setShowMembers] = useState(false);
  
    const handleSearch = async () => {
      try {
        const findMembers = await axios.get(`${process.env.REACT_APP_USER_API_URL}/findUsersInfo`, {
          params: {
              nickname: searchQuery
          }
        });
  
        setMembers(findMembers.data);
        setShowMembers(true);
      } catch(e) {
        setMembers([]);
      }
      
    };
  
    return (
      <div>
        <h1>회원 검색 앱</h1>
        <SearchBar onSearch={setSearchQuery} onSearchButtonClick={handleSearch} />
        {showMembers && <MemberList members={members} />}
      </div>
    );
  };

  const SearchBar = ({ onSearch, onSearchButtonClick }) => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onSearchButtonClick();
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="유저를 검색하세요..."
          onChange={(e) => onSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={onSearchButtonClick}>검색</button>
      </div>
    );
  };

  
const MemberList = ({ members }) => {
  console.log(members);
  return (
    <ul>
      {members.map((member, index) => (
        <li key={index}>
          <a href={'/profile?user=' + member.id}>{member.nickname}</a>
        </li>
      ))}
    </ul>
  );
};
  
  export default FindUser;