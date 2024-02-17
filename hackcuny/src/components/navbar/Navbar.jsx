import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import './navbar.css'

import {auth} from '../../firebase'
import { onAuthStateChanged,signOut } from "firebase/auth";

const Navbar = () => {
    //check if user signed in
    const [authUser,setAuthUser] = useState(null);
    useEffect(()=>{
        const listen = onAuthStateChanged(auth,(user)=>{
            if(user){
                setAuthUser(user)
            }else{
                setAuthUser(null)

            }
        });

        return ()=>{
            listen();
        }
    },[])
    //signout function
    const userSignOut = () =>{
        signOut(auth).then((
            console.log("Signed Out Successfully")
        )).catch(error => console.log(error))
    }
    return(
        <div className="navbar-container">
            <Link to='/'>Home</Link>
        {authUser? 
            <div>
            <button onClick={userSignOut}>Sign Out</button>
            </div>
            :
        <div>
            <Link to='/signup'><button>Sign Up</button></Link>
            <Link to='/signin'><button>Sign In</button></Link>
        </div>
        }
        </div>
    )
}
export default Navbar