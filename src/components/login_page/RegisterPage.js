import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';

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
        setErrors(newErrors)

        if(Object.keys(errors).length > 0){
            setSubmit(false)
        }
        else setSubmit(true)
        
    },[id, isValidID, email, password, nickname, isValidNickname])

    return(
        <form onSubmit={handleSubmit}>
            <h2>회원가입</h2>
            <ul>
                <li>
                    <label htmlFor="userid">아이디 :&nbsp;</label> 
                    <input type='text' name="id" onChange={(e) => checkID(e.target.value)} />
                    {errors.id && <span>{errors.id}</span>} 
                </li>
                <li>
                    <label htmlFor="email">이메일 :&nbsp;</label> 
                    <input type='email' name="email" onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span>{errors.email}</span>} 
                </li>
                <li>
                    <label htmlFor="password">패스워드 :&nbsp;</label>
                    <input type='password' name="password" onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span>{errors.password}</span>}
                </li>
                <li>
                    <label htmlFor="nickname">닉네임 :&nbsp;</label>
                    <input type='nickname' name="nickname" onChange={(e) => checkNickname(e.target.value)} />
                    {errors.nickname && <span>{errors.nickname}</span>}
                </li>
                <li>
                    <input type='submit' value="가입" disabled={!submit} />
                </li>
            </ul>
        </form>
    )
}

export default Register