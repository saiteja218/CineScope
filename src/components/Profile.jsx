import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import Home from './Home'
import CardMedia from '@mui/material/CardMedia';
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
const image_api = "https://image.tmdb.org/3/t/p/w500/";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button'; 
import { updateDoc,setDoc,deleteDoc,deleteField } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


export default function Profile({auth}) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState();
  const [edit,setEdit]=useState(false)
  const [review,changeReview]=useState("")
  const [rating,setRating]=useState('')
  const [changeMovieReview,setchangeReview]=useState()
  const navigate=useNavigate();

  useEffect(() => {
    async function getName() {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = userDoc.data();
      setName(data.Username)
    }
    getName()
  }, [reviews,auth.currentUser])
  useEffect(() => {
    async function getReviews() {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const objs = userDoc.data();
      const userData = Object.values(objs)
      userData.pop();
      // console.log(userData);
      setReviews(userData)
    }
    getReviews();
  }, [auth.currentUser])


  function editReview(re) {
    setEdit(true);
    setchangeReview(re)
  }

async function handleSubmitReview(){
    const updatedReviews = [...reviews];

  // console.log(updatedReviews);
  // let index;
  for(let i=0;i<reviews.length;i++){
         if(updatedReviews[i].id==changeMovieReview.id){
          updatedReviews[i].userReview=review
          updatedReviews[i].userRating=rating
          break;
         }
  }
  setReviews(updatedReviews); 
  // console.log(reviews)

  
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const existingData = userDoc.data();
    const myName = existingData.Username;
    const newReview = {
      userId: auth.currentUser.uid,
      name: myName,
      id: changeMovieReview.id,
      genre_ids: changeMovieReview.genre_ids,
      title: changeMovieReview.title,
      poster_path: changeMovieReview.poster_path,
      userReview: review,
      userRating: rating
    };
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      [newReview.id]:newReview

    }).then((response) => {
      // console.log("review edited")
    })

    
    const reviewDocRef = doc(db, "reviews", "allReviews");


const reviewDocSnapshot = await getDoc(reviewDocRef);

if (reviewDocSnapshot.exists()) {
    const reviewId = newReview.userId + "_" + newReview.id; 

    await updateDoc(reviewDocRef, {
        [reviewId]: newReview
    });
} 
   


    const moviesDoc=(doc(db,"movies",changeMovieReview.id.toString()))
    await updateDoc(moviesDoc,{[newReview.userId]:newReview}).then((response) => {
      // console.log("review edited in movies also")
    })

}

  async function deleteReview(rev) {
     
    let updatedReviews=reviews.filter(r=>r.id!==rev.id)
    setReviews(updatedReviews)
    

    const moviesRef=await doc(db,"movies",rev.id.toString());
    await deleteDoc(moviesRef,rev.id)

    const reviewDocRef = doc(db, "reviews", "allReviews");
    const reviewId = rev.userId + "_" + rev.id; 

     // Use updateDoc with FieldValue.delete() to remove the specific field (review)
     await updateDoc(reviewDocRef, {
      [reviewId]: deleteField()
  });


  const userRef = await (doc(db, "users", auth.currentUser.uid));
  await updateDoc(userRef, {
        [rev.id]: deleteField()
    }).then((response) => {
      // console.log("deleted")
    });

  }

  

  

  const handleCloseReview = () => {
    setEdit(false);
  };



  return (
    <div>
      <Home />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyContent: "space-evenly", paddingTop: "1rem" }}>
        {
          reviews.map((review, index) => {
            return (
              <Card key={index} sx={{ margin: "1rem" }}>
                <CardContent sx={{padding:"5px"}}>
                  <div style={{  display: "grid", gridTemplateColumns: "70% 30%",gap:"10px" }}>
                    <div >
                      <Typography variant="button" display="block" gutterBottom onClick={() => { navigate("/review", { state: review.userId }) }} sx={{ cursor: "pointer", borderBottom: "3px solid grey" }}>

                        <div style={{ display: "flex", alignItems: 'center' }}>
                          <AccountCircleIcon fontSize='small' sx={{ margin: "4px" }} />
                          {review.name}
                        </div>
                      </Typography>
                      <Rating name="read-only" value={review.userRating} readOnly />
                      <p>{review.userReview}</p>
                      <div style={{ margin: "1rem" }} className=''>
                        <EditNoteIcon fontSize="large" sx={{ margin: "5px", backgroundColor: "yellow", borderRadius: "10px", }} onClick={()=>editReview(review)} />
                        <DeleteOutlineRoundedIcon fontSize="large" sx={{ margin: "5px", backgroundColor: "red", borderRadius: "10px" }} onClick={()=>deleteReview(review)} />
                      </div>

                     
                    </div>
                    <div >
                      <CardMedia
                        component="img"
                        // height="150"
                        sx={{ width: "125px", cursor: "pointer" }}
                        onClick={() => navigate(`/movie/:${review.id}`, { state: review })}
                        image={image_api + review.poster_path}
                        alt="Paella dish"

                      />
                    </div>
                  </div>
                  {edit && (
                        <div className="review" style={{
                          
                          position: 'fixed',
                          top: '0',
                          left: '0',
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1050,
                          backgroundColor: 'rgba(0, 0, 0, 0.2)'


                        }}>
                          <Card sx={{height:"50%", display: "flex", alignItems: "center" }}>
                            <CardContent>
                              <TextField
                                id="outlined-multiline-static"
                                label="Enter Your Review Here"
                                variant="standard"
                                multiline
                                rows={5}
                                sx={{ width: "100%", margin: "1.5rem 0", borderBottom: "2px solid grey", marginTop: '0.5rem' }}
                                onChange={(e) => {
                                  changeReview(e.currentTarget.value);
                                }}
                              />

                              <FormControl fullWidth sx={{ margin: "0.5rem 0" }}>
                                <InputLabel id="demo-simple-select-label" >Select Your Rating</InputLabel >
                                <Select
                                  labelId="demo-simple-select-label"

                                  value={rating}
                                  label="Select your Rating"
                                  onChange={e => { setRating(e.target.value); }}
                                >
                                  <MenuItem value={1}>1 Star</MenuItem>
                                  <MenuItem value={2}>2 Stars</MenuItem>
                                  <MenuItem value={3}>3 Stars</MenuItem>
                                  <MenuItem value={4}>4 Stars</MenuItem>
                                  <MenuItem value={5}>5 Stars</MenuItem>
                                </Select>
                              </FormControl>



                              <Button variant="contained" sx={{ margin: "10px 5px" }} onClick={() => { handleSubmitReview(review); handleCloseReview(); }}>Submit Review</Button>
                              <Button variant="outlined" sx={{ margin: "10px 5px" }} onClick={handleCloseReview}>Close</Button>
                            </CardContent>
                          </Card>


                        </div>
                      )}
                </CardContent>
              </Card>
              
            )
            
          })
        }

      </div>
    </div>
  )
}
