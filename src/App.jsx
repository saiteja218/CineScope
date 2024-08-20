import * as React from 'react';
import {useEffect} from 'react';


import './App.css'
import Login from './components/Login'
import Signup from './components/Signup';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Main from './components/Main';
import Movie from './components/Movie';
import { Route,Routes, useNavigate } from 'react-router-dom';
import Profile from './components/Profile';
import Review from './components/Review';
import UserReview from './components/UserReview';

function App() {
  const navigate=useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        // console.log("User logged in:", user.email);
        navigate('/home');
        
      }
      else{
        navigate("/")
        // console.log("there is no user");
        
      }
    })
  },[])

  return (
    <div>
       
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/home' element={<Main/>} />
        
        <Route path='/movie/:id' element={<Movie/>} />
        <Route path='/myreviews' element={<Review auth={auth}/>} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/review' element={<UserReview/>} />
      </Routes>


    </div>
  )
}

export default App
