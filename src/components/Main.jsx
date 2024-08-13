import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent';
const apiKey = "273df455c13daefb614b7a4b22047fd1";
const playingKey = "https://api.themoviedb.org/3/movie/now_playing?api_key=";
const ratedKey = "https://api.themoviedb.org/3/movie/top_rated?api_key=";
const popularKey = "https://api.themoviedb.org/3/movie/popular?api_key=";
const image_api = "https://image.tmdb.org/3/t/p/w500/";
import CardMedia from '@mui/material/CardMedia';
import './styles/main.css'
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import {auth} from '../firebase'

function Main() {
    const [playing, setPlaying] = useState([])
    const [rated, setRated] = useState([])
    const [popular, setPopular] = useState([])
    const [allMovies,setMovies]=useState([]);
    const navigate=useNavigate();
    // useEffect(()=>{
    //     function printUser(){
    //         const user=auth.currentUser;
    //         console.log(user);
    //     }
    //     printUser();
    // },[])
    
    useEffect(() => {
        const fetchPlayingMovies = async () => {
            let movies = [];
            for (let i = 1; i < 3; i++) {
                const response = await axios.get(`${playingKey}${apiKey}&page=${i}`);
                movies = movies.concat(response.data.results);
            }
            setPlaying(movies);
            
        };

        fetchPlayingMovies();

    }, [])
    useEffect(() => {
        const fetchRatedMovies = async () => {
            let movies = [];
            for (let i = 1; i < 3; i++) {
                const response = await axios.get(`${ratedKey}${apiKey}&page=${i}`);
                movies = movies.concat(response.data.results);
            }
            setRated(movies);
           
        };

        fetchRatedMovies();

    }, [])
    useEffect(() => {
        const fetchPopularMovies = async () => {
            let movies = [];
            for (let i = 1; i < 3; i++) {
                const response = await axios.get(`${popularKey}${apiKey}&page=${i}`);
                movies = movies.concat(response.data.results);
            }
            setPopular(movies);
            
        };

        fetchPopularMovies();

    }, [])

    // useEffect(() => {
    //     const allMoviesCombined = [...playing, ...rated, ...popular];
    //     const uniqueMovies = Array.from(new Set(allMoviesCombined.map(movie => movie.id)))
    //         .map(id => {
    //             return allMoviesCombined.find(movie => movie.id === id);
    //         });
    //     setMovies(uniqueMovies);
    //     console.log(uniqueMovies);
        
    // }, [playing, rated, popular]);
    

    return (
        <div>
            <Home/>
            <div style={{ backgroundColor: "" ,margin:"1.2rem"}}>
                <h3>Now Playing</h3>
                <div style={{ display: "flex" }}  className='scroll-bar'>
                    {

                        playing.map((movie, index) => {
                            return (
                                <div key={index} style={{}} onClick={()=>{navigate(`/movie/:${movie.id}`, {state:movie})}}>
                                    
                                    <Card sx={{ width: "180px", margin: "2px", borderRadius: "10px" ,paddingBottom:"2px"}}>
                                        <CardContent sx={{padding:"0px"}}>
                                            {/* <img src={image_api+movie.poster_path} alt=""  height={220} width={180}/> */}
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={image_api + movie.poster_path}
                                                alt="Paella dish"
                                                
                                            />
                                            <p style={{padding:"1px 3px"}}>{((movie.title).length>23) ? (movie.title).substring(0,23)+".."  : (movie.title)} </p>

                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div style={{ backgroundColor: "" ,margin:"1.2rem"}}>
                <h3>Popular Now</h3>
                <div style={{ display: "flex" }}  className='scroll-bar'>
                    {

                        popular.map((movie, index) => {
                            return (
                                <div key={index} onClick={()=>{navigate(`/movie/:${movie.id}`, {state:movie})}}>
                                    <Card sx={{ width: "180px", margin: "2px", borderRadius: "10px" ,paddingBottom:"2px"}} >
                                        <CardContent sx={{padding:"0px"}}>
                                            {/* <img src={image_api+movie.poster_path} alt=""  height={220} width={180}/> */}
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={image_api + movie.poster_path}
                                                alt="Paella dish"
                                                
                                            />
                                            <p style={{padding:"1px 3px"}}>{((movie.title).length>23) ? (movie.title).substring(0,23)+".."  : (movie.title)} </p>

                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div style={{ backgroundColor: "" ,margin:"1.2rem"}}>
                <h3>Top Rated</h3>
                <div style={{ display: "flex" }}  className='scroll-bar'>
                    {

                        rated.map((movie, index) => {
                            return (
                                <div key={index} onClick={()=>{navigate(`/movie/:${movie.id}`, {state:movie})}} >
                                    <Card sx={{ width: "180px", margin: "2px", borderRadius: "10px" ,paddingBottom:"2px"}}>
                                        <CardContent sx={{padding:"0px"}}>
                                            {/* <img src={image_api+movie.poster_path} alt=""  height={220} width={180}/> */}
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={image_api + movie.poster_path}
                                                alt="Paella dish"
                                                
                                            />
                                            <p style={{padding:"1px 3px"}}>{((movie.title).length>23) ? (movie.title).substring(0,23)+".."  : (movie.title)} </p>

                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Main
