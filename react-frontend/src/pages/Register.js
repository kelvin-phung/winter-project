import React, {useState} from 'react';
import Axios from 'axios';
import CSRFTOKEN from '../components/CSRF_token';

Axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
Axios.defaults.xsrfCookieName = "csrftoken";

export default function Register() {
    const url = "http://127.0.0.1:8000/register/"
    const [data, setData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    })

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
                Username: <input onChange={(e)=>handle(e)} id="username" value={data.username} type="text"></input>
                <br></br>
                Email: <input onChange={(e)=>handle(e)} id="email" value={data.email} type="text"></input>
                <br></br>
                Password: <input onChange={(e)=>handle(e)} id="password1" value={data.password1} type="text"></input>
                <br></br>
                Re-enter password: <input onChange={(e)=>handle(e)} id="password2" value={data.password2} type="text"></input>
                <br></br>
                <button>Register</button>
            </form>
        </div>
    )
}