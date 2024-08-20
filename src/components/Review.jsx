import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import Home from './Home'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';
const image_api = "https://image.tmdb.org/3/t/p/w500/";
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Review() {
  
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState();
  const navigate=useNavigate();
  const [uid,setUid]=useState();

  useEffect(()=>{
    async function getuid(){
        const user=await auth.currentUser;
        if(user){
          setUid(user.uid);
        }else{
          setTimeout(getuid,10)
        }
      }
      getuid();
    },[])

  
  useEffect(() => {
    async function getName() {
      const userDoc = await getDoc(doc(db, "users", uid));
      const data = userDoc.data();
      setName(data.Username)
    }
    getName()
  }, [reviews])

  useEffect(() => {
    async function getReviews() {
      const userDoc = await getDoc(doc(db, "reviews", "allReviews"));
      const objs = userDoc.data();
      const userData = Object.values(objs)
      // userData.pop();
      // console.log(userData)
      setReviews(userData);

    }
    getReviews();
  }, [])

  return (
    <div>
      <Home />
      <h1 style={{padding:"1rem"}}>Reviews given by CineScope Users</h1>
      <div style={{ display: "grid", gridTemplateColumns:"1fr 1fr 1fr",justifyContent:"space-evenly",paddingTop:"0.1rem" }}>
        {
          reviews.map((review, index) => {
            return (
              <Card key={index} sx={{margin:"1rem"}}>
                <CardContent sx={{ display:"grid",gridTemplateColumns:"70% 30%" ,gap:"10px",justifyContent:"space-evenly"}}>
                  {/* <div > */}
                    <div >
                      <span>
                      
                    <Typography variant="button" display="block" gutterBottom onClick={()=>{navigate("/review",{state:review.userId})}} sx={{cursor:"pointer",borderBottom:"3px solid grey"}}>
                       
                       <div style={{display:"flex",alignItems:'center'}}>
                       <AccountCircleIcon fontSize='small' sx={{margin:"4px"}}/>
                       {review.name}
                       </div>
                       </Typography>
                      </span>
                      <Rating name="read-only" value={review.userRating} readOnly />
                      <p>{review.userReview}</p>
                    </div>
                    <div >
                      
                      <CardMedia
                        component="img"
                        // height="150"
                        sx={{ width: "125px",cursor:"pointer" }}
                        onClick={()=>navigate(`/movie/:${review.id}`, {state:review})}
                        image={image_api + review.poster_path}
                        alt="Paella dish"
                  
                      />
                     
                      
                    {/* </div> */}
                  </div>
                </CardContent>
              </Card>
            )
          })
        }

      </div>
    </div>
  )
}
