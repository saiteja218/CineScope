import React, { useState } from 'react'
import bg from '../assets/bg2.webp'
import './styles/login.css'
import logo from '../assets/logo.png'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  const [error, setError] = useState("");

   async function handleLogin(){
    if (!email || !password) {
      setError("Email and password cannot be empty.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // console.log("Authentication successful!");
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed", error.message);
      setError("Failed to login. Please check your email and password.");
    }
  }
  

  const handleNavigation = () => {
    navigate('/signup');
  };



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
          <div style={{margin:"40px 10px",marginTop:"10px"}}>
          <TextField id="outlined-basic" label="Enter Email" variant="outlined" sx={{width:"450px"}} onChange={(e)=>{
            setEmail(e.currentTarget.value)
          }}/>
          </div>
          <div style={{margin:"10px",marginBottom:"40px"}}>
          <TextField   id="password-field" type="password" label="Enter Password" variant="outlined" sx={{width:"450px"}}  onChange={(e)=>{
            setPassword(e.currentTarget.value)
          }}/>
          </div>

          <div className='button-container'>
              <Button style={{ margin: "0 10px", width: "120px" }} variant="contained" onClick={()=>{
                handleLogin()
              }}>Login</Button>
            </div>

          
         
          </CardContent>
        </Card>
        {error && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "20px"}}>{error}</p>) }
        <span style={{ color: "white" }}>
      Didn't have an account? <a style={{ color: "white", cursor: "pointer" }} onClick={handleNavigation}>Register</a>
    </span>
        
      </div>
    </div>
  )
}

export default Login
