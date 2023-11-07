import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';

import "./RegisterPage.css";

const validate = (input) => {    
    const {id,isValidID,email,password,nickname,isValidNickname} = input
    const errors = {}

    if(!id){
        errors.id="아이디가 입력되지 않았습니다."
    } else if(!isValidID) {
        errors.id="유효하지 않은 아이디입니다."
    }

    if(email === ''){
        errors.email="이메일이 입력되지 않았습니다."
    } else if(!/^[a-z0-9%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(email)){
        errors.email = "입력된 이메일이 유효하지 않습니다."
    }

    if(!password){
        errors.password="비밀번호가 입력되지 않았습니다."
    } else if(password.length < 8){
        // errors.password = "8자 이상의 패스워드를 사용해야 합니다."
    }

    if(nickname === ''){
        errors.nickname="닉네임이 입력되지 않았습니다."
    } else if(nickname.length > 9){
        errors.nickname="닉네임이 너무 깁니다 9자 이하의 닉네임을 사용해주세요."
    } else if(!isValidNickname) {
        errors.nickname="유효하지 않은 닉네임입니다."
    }

    return errors 
}

function Register() {
    const [id, setID] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [submit,setSubmit] = useState(false)
    const [isValidID, setValidID] = useState(false)
    const [isValidNickname, setValidNickname] = useState(false)
    const [errors,setErrors] = useState({})

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_USER_API_URL}/registerUser`, {
                    id,
                    email,
                    password,
                    nickname
                });
    
                if (response.status === 201) {
                    alert('회원가입이 완료되었습니다.');
                    navigate('/login');
                }
            } catch (error) {
                alert('회원가입 중 오류가 발생했습니다.');
            }
        }
    } 

    const checkID = async (id) => {
        if(id) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_USER_API_URL}/checkInvalidID`, {
                    params: {id}
                });
                if (response.status === 200) {
                    setValidID(true);
                }
            } catch (e) {
                setValidID(false);
            } finally {
                setID(id);
            }
        }
        else setID(id);
    }

    const checkNickname = async (nickname) => {
        if(nickname) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_USER_API_URL}/checkInvalidNickname`, {
                    params: {nickname}
                });
                if (response.status === 200) {
                    setValidNickname(true);
                }
            } catch (e) {
                setValidNickname(false);
            } finally {
                setNickname(nickname);
            }
        }
        else setNickname(nickname);
    }
    
    // form 체크
    useEffect(()=>{
        const input = {
            id,
            isValidID,
            email,
            password,
            nickname,
            isValidNickname
        }
        const newErrors = validate(input);
        setErrors(newErrors);

        if(Object.keys(newErrors).length > 0){
            setSubmit(false)
        }
        else {
            console.log("0 error")
            setSubmit(true)
        }
        
    },[id, isValidID, email, password, nickname, isValidNickname])

    return(
        <form className='register_form' onSubmit={handleSubmit}>
            <ul>
                <li>
                    <label htmlFor="id"></label> 
                    <input 
                        className={`register_input ${errors.id ? 'error' : ''}`}
                        type='text'
                        placeholder='&nbsp;&nbsp;아이디' 
                        id="id" 
                        name="id" 
                        autoComplete='off' 
                        onChange={(e) => checkID(e.target.value)} 
                    />
                </li>
                <li>
                    <label htmlFor="email"></label> 
                    <input 
                        className={`register_input ${errors.email ? 'error' : ''}`} 
                        type='email' 
                        placeholder='&nbsp;&nbsp;이메일' 
                        id="email" 
                        name="email" 
                        autoComplete='off' 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </li>
                <li>
                    <label htmlFor="password"></label>
                    <input 
                        className={`register_input ${errors.password ? 'error' : ''}`} 
                        type='password' 
                        placeholder='&nbsp;&nbsp;비밀번호' 
                        id="password" 
                        name="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </li>
                {errors.id && <span>{errors.id}</span>} 
                {errors.email && <span>{errors.email}</span>} 
                {errors.password && <span>{errors.password}</span>}
                <div className='name_input'>이름</div>
                <li>
                    <label htmlFor="nickname">&nbsp;</label>
                    <input 
                        className={`register_input ${errors.nickname ? 'error' : ''}`} 
                        type='nickname' 
                        placeholder='&nbsp;&nbsp;이름을(를) 입력하세요' 
                        id="nickname" 
                        name="nickname" 
                        autoComplete='off' 
                        onChange={(e) => checkNickname(e.target.value)} 
                    />
                </li>
                {errors.nickname && <span>{errors.nickname}</span>}
                <li>
                    <input 
                        className='register_input submit_button' 
                        type='submit' 
                        value="가입하기" 
                        disabled={!submit} 
                    />
                </li>
            </ul>
        </form>
    )
}

export default Register