import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';
import {useNavigate} from 'react-router-dom';
import './pages.css';
import NavBar from '../components/NavBar'

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function NewEntry() {
    const url = "http://127.0.0.1:8000/new-entry/";
    let navigate = useNavigate();
    const curr_datetime = new Date()
    const offset = curr_datetime.getTimezoneOffset()
    const [data, setData] = useState({
        date: new Date(curr_datetime.getTime() - (offset*60*1000)).toISOString().split('T')[0],
        rating: null,
        description: "",
    })
    console.log(data)
    const [valid, setValid] = useState(0)
    const [dateErrors, setDateErrors] = useState([])
    const [ratingErrors, setRatingErrors] = useState([])
    const [descErrors, setDescErrors] = useState([])

    useEffect(() => {
        if(valid===1){
            navigate('/home');
        }
    }, [valid, navigate]);

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            date: data.date,
            rating: data.rating,
            description: data.description,
        })
        .then(response => {
            setValid(response.data['valid'])
            setDateErrors(response.data['date_errors'])
            setRatingErrors(response.data['rating_errors'])
            setDescErrors(response.data['desc_errors'])
        });
    }

    function handle(e){
        const newdata = {...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }

    return (
        <div>
            <NavBar home={0}></NavBar>
            <div className='container'>
                <div className='form-container'>
                    <form onSubmit={(e) => submit(e)}>
                        <CSRFTOKEN />
                        Date: <input onChange={(e)=>handle(e)} id="date" value={data.date} type="date"></input>
                        {dateErrors.length !== 0 ? <ul>{dateErrors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                        Rating: <input onChange={(e)=>handle(e)} id="rating" value={data.rating} type="number" min="1" max="10" step="1"></input>
                        {ratingErrors.length !== 0 ? <ul>{ratingErrors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                        Description: <input onChange={(e)=>handle(e)} id="description" value={data.description} type="text"></input>
                        {descErrors.length !== 0 ? <ul>{descErrors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                        <button>Submit</button>
                        <button type='button' onClick={() => navigate(-1)}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    )
}