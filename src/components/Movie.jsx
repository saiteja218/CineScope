import React, { useEffect, useState } from 'react'
import Home from './Home'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const image_api = "https://image.tmdb.org/3/t/p/w500/";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { auth } from '../firebase'
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { getDoc } from 'firebase/firestore';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const apiKey = "&api_key=273df455c13daefb614b7a4b22047fd1";
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Movie() {
  const navigate = useNavigate();
  let url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=';
  const location = useLocation()
  const movie = location.state;
  const id=movie.id;
  // console.log(movie);
  const genreIds = (movie.genre_ids);
  // console.log(genreIds)
  const [rating, setRating] = React.useState('');
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [similar, setSimilar] = useState([])


  genreIds.forEach(id => {
    url += (id.toString() + "%2C")
  })
  url = url.substring(0, url.length - 3);
  // console.log(url)
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      let movies = [];

      const response = await axios.get(`${url}${apiKey}`);
      // movies = movies.concat(response.data.results);
      movies = movies.concat(response.data.results);


      // console.log(movies)
      setSimilar(movies);

    };

    fetchSimilarMovies();

 
    async function getNameAndReviews() {
      const MovieDoc = await getDoc(doc(db, "movies", movie.id.toString()));
      const objOfObj = MovieDoc.data();
      const reviewArray = objOfObj ? Object.values(objOfObj) : "";
      console.log(reviewArray);
      setAllReviews(reviewArray);
    }
    getNameAndReviews();
  }, [movie])



  // useEffect(()=>{

  // },[])
  async function handleSubmitReview() {
    // console.log(review+""+rating) 
    const MovieId = movie.id;
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const existingData = userDoc.data();
    const myName = existingData.Username;
    const newReview = {
      userId: auth.currentUser.uid,
      name: myName,
      id: movie.id,
      genre_ids: genreIds,
      title: movie.title,
      poster_path: movie.poster_path,
      userReview: review,
      userRating: rating
    };
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      ...existingData,
      [MovieId]:
        newReview

    }).then((response) => {
      // console.log("review uploaded")
    })

    const movieDoc = await getDoc(doc(db, "movies", (movie.id.toString())));
    const ExistingReviews = movieDoc.data();
    let all = ExistingReviews ? {
      ...ExistingReviews,
      [auth.currentUser.uid]: newReview

    } : { [auth.currentUser.uid]: newReview }
    await setDoc(doc(db, "movies", (movie.id.toString())), {
      ...all
    }).then((response) => {
      // console.log("review uploaded to movies also")
    })

    //for review page
    const reviewDoc = await getDoc(doc(db, "reviews", "allReviews"));
    const prevReview = reviewDoc.data();
    // console.log(prevReview)
    const uniqueKey = `${auth.currentUser.uid}_${movie.id}`;
    let newReviewSet = prevReview ? {
      ...prevReview,
      [uniqueKey]: newReview

    } : { [uniqueKey]: newReview }
    await setDoc(doc(db, "reviews", "allReviews"), { ...newReviewSet }).then(response => {
      // console.log("updated in reviews list also")
    }
    );

    setAllReviews(prevReviews => [newReview, ...prevReviews]); // Update the state with the new review
    handleCloseReview();

  }

  const handleReviewClick = () => {
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };
  const handleSimilarMovieClick = (similarMovie) => {
    navigate(`/movie/:${similarMovie.id}`, { state: similarMovie });
    window.scrollTo(0, 0);
  };


  return (
    <div>
      <Home />
      <Box sx={{ flexGrow: 1, padding: "0.5rem" }}>
        <Grid container spacing={2} sx={{ paddingLeft: "1.5rem" }}>
          <Grid item xs={6} sx={{ padding: '1rem', borderRight: "3px solid grey", }}  >
            <div>
              <img src={image_api + movie.poster_path} alt="" height={400} width={300} />

              <p style={{ padding: "10px 0px", fontSize: "1.4rem", fontWeight: "600" }}>{(movie.title)} </p>

              <div style={{ paddingBottom: "10px" }}>
                <h4>Overview:</h4> <br />

                <p>{movie.overview}</p>
              </div>
              <Button onClick={handleReviewClick} variant="contained" sx={{ backgroundColor: "red", margin: "0" }}>Write a Review</Button>

              {showReview && (
                <div className="review" style={{
                  width: "100%",
                  height: "100%",
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'

                }}>
                  <Card sx={{  height: "50%", opacity: "1", display: "flex", alignItems: "center" }}>
                    <CardContent>
                      <TextField
                        id="outlined-multiline-static"
                        label="Enter Your Review Here"
                        variant="standard"
                        multiline
                        rows={5}
                        sx={{ width: "100%", margin: "1.5rem 0", borderBottom: "2px solid grey", marginTop: '0.5rem' }}
                        onChange={(e) => {
                          setReview(e.currentTarget.value);
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



                      <Button variant="contained" sx={{ margin: "10px 5px" }} onClick={() => { handleSubmitReview(); handleCloseReview(); }}>Submit Review</Button>
                      <Button variant="outlined" sx={{ margin: "10px 5px" }} onClick={handleCloseReview}>Close</Button>
                    </CardContent>
                  </Card>


                </div>
              )}
              <div style={{ margin: "16px 0" }}>
                <h3 style={{ margin: "10px 0" }}> Similar Movies</h3>
                <div style={{ display: "flex", flexWrap: "wrap", }}>
                  {
                    similar.map((similarMovie, index) => {
                      
                      return (
                        movie.id!==similarMovie.id && (

                        <div key={index} style={{ margin: "7px" }} onClick={() =>  handleSimilarMovieClick(similarMovie)}>

                          <Card sx={{ width: "130px", margin: "2px", borderRadius: "10px", paddingBottom: "2px",cursor:"pointer" }} >
                            <CardContent sx={{ padding: "0px" }}>
                              {/* <img src={image_api+movie.poster_path} alt=""  height={220} width={180}/> */}
                              <CardMedia
                                component="img"
                                height="180"
                                image={image_api + similarMovie.poster_path}
                                alt="Paella dish"

                              />  
                              <p style={{ padding: "1px 3px" }}>{((similarMovie.title).length > 15) ? (similarMovie.title).substring(0, 15) + ".." : (similarMovie.title)} </p>

                            </CardContent>
                          </Card>
                        </div>)
                      )
                    })
                  }
                </div>
              </div>

            </div>
          </Grid>
          <Grid item xs={6} className="allReviews">
            <h2 style={{marginBottom:"10px"}}>Reviews by CineScope Users</h2>
            <div>
            {
              allReviews.length ? (
                allReviews.map((review, index) => (
                  <div key={index} style={{ marginBottom: "10px",borderBottom: (index===(allReviews.length-1))?"none":"3px solid grey",paddingBottom:"6px" }}>
                   <Typography variant="h6" display="block" gutterBottom onClick={()=>{navigate("/review",{state:review.userId})}} sx={{cursor:"pointer"}}>
                       
                       <div style={{display:"flex",alignItems:'center'}}>
                       <AccountCircleIcon fontSize='small' sx={{margin:"4px"}}/>
                       {review.name}
                       </div>
                       </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                      {review.userReview}
                    </Typography>
                    <Rating value={review.userRating} readOnly />
                  </div>
                ))
              ) : (
                <Typography variant="body2">No reviews yet.</Typography>
              )
            }
            </div>
          </Grid>


        </Grid>
      </Box>

    </div>
  )
}

export default Movie
