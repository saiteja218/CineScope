import React,{useState} from 'react'
import bg from '../assets/bg2.webp'
import './styles/login.css'
import logo from '../assets/logo.png'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from "firebase/firestore"; 
import {db} from '../firebase';

function Signup() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const navigate=useNavigate();
  async function handleSignup(){
   const userCredential =await createUserWithEmailAndPassword(auth,email,password) 
          
          // console.log("Signin Sucessfull");
          // console.log(userCredential.user.name)
          const collectionReference=doc(db,"users",userCredential.user.uid);
          setDoc((collectionReference),{
            Username:name,
            
          }).then(response=>{
            // console.log("data added")
          })
          navigate("/")
    
      
  
  }

   

  return (
    <div className='login-main'
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}>

      <div className='main-2' style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <div className='form-div'>
          <img src={logo} alt="logo" />
          <h3 className='heading'>CineScope</h3>
        </div>

        <Card  sx={{width:"500px",margin:"10px",borderRadius:"15px"}}>
          <CardContent>
          <div style={{margin:"40px 10px",marginTop:"10px",marginBottom:"20px"}}>
          <TextField  id="name-field" label="Enter Your Name" variant="outlined" sx={{width:"450px"}} onChange={e=>{
            setName(e.currentTarget.value);
          }}/>
          </div>
          <div style={{margin:"20px 10px"}}>
          <TextField  id="email-field" label="Enter Email" variant="outlined" sx={{width:"450px"}} onChange={(e)=>{
            setEmail(e.currentTarget.value)
          }}/>
          </div>
          <div style={{margin:"10px",marginBottom:"40px"}}>
          <TextField  id="password-field" type="password" label="Enter Password" variant="outlined" sx={{width:"450px"}}  onChange={(e)=>{
            setPassword(e.currentTarget.value)
          }}/>
          </div>

          <div className='button-container'>
              <Button style={{ margin: "0 10px", width: "120px" }} variant="contained" onClick={()=>{
                handleSignup();
              }}>Signup</Button>
            </div>

          
         
          </CardContent>
        </Card>

        <span style={{color:"white"}}>Already have an account? <a style={{color:"white",cursor:"pointer"}}   onClick={()=>{navigate("/")}}>Log in</a></span>

      </div>
    </div>
  )
}

export default Signup
