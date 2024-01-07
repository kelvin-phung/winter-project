import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';
import {Link, useNavigate} from 'react-router-dom';

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function Register() {
    const url = "http://127.0.0.1:8000/register/"
    let navigate = useNavigate()
    const [data, setData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    })
    const [valid, setValid] = useState(0)
    const [userErrors, setUserErrors] = useState([])
    const [emailErrors, setEmailErrors] = useState([])
    const [pass1Errors, setPass1Errors] = useState([])
    const [pass2Errors, setPass2Errors] = useState([])

    useEffect(() => {
        if(valid===1){
            console.log('eat');
            navigate('/login');
        }
    }, [valid, navigate]);

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            username: data.username,
            email: data.email,
            password1: data.password1,
            password2: data.password2,
        })
        .then(response => {
            console.log(response.data)
            setValid(response.data['valid'])
            setUserErrors(response.data['u_errors'])
            setEmailErrors(response.data['e_errors'])
            setPass1Errors(response.data['p1_errors'])
            setPass2Errors(response.data['p2_errors'])
            console.log(response.data['p1_errors'].length)
        })
    }

    function handle(e){
        const newdata = {...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }

    return (
        <div className='container'>
            <div className='form-container' id='register'>
                <form onSubmit={(e) => submit(e)}>
                    <CSRFTOKEN />
                    Username: <input onChange={(e)=>handle(e)} id="username" value={data.username} type="text"></input>
                    {userErrors.length !== 0 ? <ul>{userErrors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                    Email: <input onChange={(e)=>handle(e)} id="email" value={data.email} type="text"></input>
                    {emailErrors.length !== 0 ? <ul>{emailErrors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                    Password: <input onChange={(e)=>handle(e)} id="password1" value={data.password1} type="password" name="password"></input>
                    {pass1Errors.length !== 0 ? <ul>{pass1Errors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                    Re-enter password: <input onChange={(e)=>handle(e)} id="password2" value={data.password2} type="password" name="password"></input>
                    {pass2Errors.length !== 0 ? <ul>{pass2Errors.map((error) => <li className='error'>{error}</li>)}</ul> : <br></br>}
                    <button>Register</button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p>Already have an account? </p><Link to='/'>Login here.</Link>
                </form>
            </div>
        </div>
    )
}