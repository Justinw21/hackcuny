import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, {useState} from 'react'
import {auth} from '../../firebase'
import './auth.css';
const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const signUp = (e) =>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
        }).catch((error)=>{
            console.log(error);
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