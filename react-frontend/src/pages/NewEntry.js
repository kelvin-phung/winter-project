import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';
import {useNavigate} from 'react-router-dom';

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function NewEntry() {
    const url = "http://127.0.0.1:8000/new-entry/";
    let navigate = useNavigate();
    const [data, setData] = useState({
        date: null,
        rating: 0,
        description: "",
    })
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
            <form onSubmit={(e) => submit(e)}>
                <CSRFTOKEN />
                Date: <input onChange={(e)=>handle(e)} id="date" value={data.date} type="date"></input>
                {dateErrors.length !== 0 ? <ul>{dateErrors.map((error) => <li>{error}</li>)}</ul> : undefined}
                <br></br>
                Rating: <input onChange={(e)=>handle(e)} id="rating" value={data.rating} type="number" min="1" max="10" step="1"></input>
                {ratingErrors.length !== 0 ? <ul>{ratingErrors.map((error) => <li>{error}</li>)}</ul> : undefined}
                <br></br>
                Description: <input onChange={(e)=>handle(e)} id="description" value={data.description} type="text"></input>
                {descErrors.length !== 0 ? <ul>{descErrors.map((error) => <li>{error}</li>)}</ul> : undefined}
                <br></br>
                <button>Submit</button>
                <button type='button' onClick={() => navigate('/home')}>Cancel</button>
            </form>
        </div>
    )
}