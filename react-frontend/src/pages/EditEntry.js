import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';
import {useNavigate, useParams} from 'react-router-dom';

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function EditEntry() {
    const {id} = useParams()
    const get_url = 'http://127.0.0.1:8000/entry/' + id
    const post_url = 'http://127.0.0.1:8000/edit-entry/' + id 
    const [data, setData] = useState({
        date: null,
        rating: 0,
        description: '',
    })
    const [valid, setValid] = useState(0)
    const [dateErrors, setDateErrors] = useState([])
    const [ratingErrors, setRatingErrors] = useState([])
    const [descErrors, setDescErrors] = useState([])
    let navigate = useNavigate()

    useEffect(() => {
        console.log('get')
        Axios.get(get_url)
        .then(response => {
            console.log(response.data)
            setData({...data, date: response.data['entry'][0][0], rating: response.data['entry'][0][1], description: response.data['entry'][0][2]})
        })
    }, [])

    useEffect(() => {
        if(valid === 1){
            navigate('/home')
        }
    }, [valid])

    function submit(e){
        e.preventDefault();
        console.log('post')
        Axios.post(post_url, {
            date: data.date,
            rating: data.rating,
            description: data.description,
        })
        .then(response => {
            setValid(response.data['valid'])
            setDateErrors(response.data['date_errors'])
            setRatingErrors(response.data['rating_errors'])
            setDescErrors(response.data['desc_errors'])
        })
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
                <button type='button' onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    )
}