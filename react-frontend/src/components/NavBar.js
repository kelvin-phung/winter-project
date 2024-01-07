import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css'

export default function NavBar({home}) {
    const login_url = "http://127.0.0.1:8000/login/";
    const logout_url = "http://127.0.0.1:8000/logout/";
    const [user, setUser] = useState('')

    useEffect(() => {
        console.log(home)
        Axios.get(login_url)
        .then(response => {
            setUser(response.data['user'])
        })
    }, [])

    function logout() {
        Axios.get(logout_url)
        .then(response => {
            console.log(response.data['status'])
        })
    }

    function welcome_or_home() {
        console.log('type', typeof(home))
        console.log('home', home)
        if(home===1){
            console.log('truee')
            return <p style={{marginLeft: '5px'}}>Welcome, <b>{user}</b>!</p>
        }
        else if(home===0){
            console.log('false!')
            return <Link style={{marginLeft: '5px'}} to='/home'>Home</Link>
        }
    }

    return (
        <nav className='nav'>
            {welcome_or_home()}
            <a style={{marginRight: '5px'}} href='/' onClick={logout}>Logout</a>
        </nav>
    )
}