import React from 'react'
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../assets/logo.png'
import { signOut } from 'firebase/auth'
import {auth} from '../firebase'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate=useNavigate();
  function handleLogout(){
    signOut(auth)
  }
  return (
    <div>
      <AppBar  style={{backgroundColor:"#cd232c",margin:"0"}}  position='sticky'>
       <div style={{width:"90vw",margin:"5px auto"}}>
        <Toolbar>
        

          <Typography  component="div" sx={{ flexGrow:1 ,fontSize:"42px",display:"flex",alignItems:"center"}}>
          <img src={logo} alt=""  height={40} width={47 } style={{paddingRight:"7px"}}/>
            <span>CineScope</span>
            <div style={{display:"inline",marginLeft:"2rem"}}>
            <Button color="inherit" onClick={()=>{navigate("/home")}}>Home</Button>
          <Button color="inherit"onClick={()=>{navigate("/myreviews")}}>Reviews</Button>
          <Button color="inherit" onClick={()=>{navigate("/profile")}}>Profile</Button>
            </div>
          </Typography>
          
          <div>
          
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </div>
          
         
        </Toolbar>
        </div>
      </AppBar>

      
    </div>
    
  )
}

export default Home
