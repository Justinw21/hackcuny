import { signInWithEmailAndPassword } from 'firebase/auth'
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {auth} from '../../firebase'
import './auth.css';
const SignIn = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate();
    const signIn = (e) =>{
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
            navigate('/');
            location.reload();
        }).catch((error)=>{
            alert("Incorrect Email/Password. Try Again.")
        })
    }
    return (
        <div className='sign-in-container sign'>
            <form onSubmit={signIn}>
                <h1>Sign into your Account</h1>
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
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}

export default SignIn