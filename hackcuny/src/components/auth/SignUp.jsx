import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, {useState} from 'react'
import {auth} from '../../firebase'
import { useNavigate } from 'react-router-dom'
import './auth.css';
const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate();
    const signUp = (e) =>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
            alert("Sign Up Successful!");
            navigate('/');
            location.reload();
        }).catch((error)=>{
            alert("Password needs to be longer than 6 characters.")
        })
    }
    return (
        <div className='sign-up-container sign'>
            <form onSubmit={signUp}>
                <h1>Create an Account</h1>
                <input 
                type="email" 
                placeholder='Enter email' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}></input>
                <input 
                type="text" 
                placeholder='Enter password' 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}>
                </input>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp