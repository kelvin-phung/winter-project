import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';
import {Link, useNavigate} from 'react-router-dom';

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function Login() {
    const url = "http://127.0.0.1:8000/login/";
    let navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
    })
    const [error, setError] = useState(0)

    useEffect(() => {
        localStorage.setItem('page', JSON.stringify(1))
        localStorage.setItem('filterPage', JSON.stringify(1))
        localStorage.setItem('filterSubmitted', JSON.stringify(false))
    }, [])
    
    useEffect(() => {
        if(error===1){
            console.log('eat');
            navigate('/home');
        }
    }, [error, navigate]);

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            username: data.username,
            password: data.password,
        })
        .then(response => {
            console.log(response.data['data'])
            console.log(response.data['authenticated'])
            setError(response.data['authenticated'])
        });
    }

    function handle(e){
        const newdata = {...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }

    return (
        <div className='container'>
            <div className='form-container'>
                <form onSubmit={(e) => submit(e)}>
                    <CSRFTOKEN />
                    Username: <input onChange={(e)=>handle(e)} id="username" value={data.username} type="text"></input>
                    <br></br>
                    Password: <input type="password" name="password" onChange={(e)=>handle(e)} id="password" value={data.password}></input>
                    <br></br>
                    <button>Login</button>
                    <br></br>
                    {error===2 ? <p className='error'>Username or password is incorrect!</p> : <br></br>}
                    <br></br>
                    <br></br>
                    <p>Don't have an account? </p><Link to='/register'>Register here.</Link>
                </form>
            </div>
        </div>
    )
}