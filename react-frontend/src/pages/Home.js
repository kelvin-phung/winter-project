import React, { useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './pages.css';
import NavBar from '../components/NavBar'

export default function Home() {
    let navigate = useNavigate()
    const home = 1

    useEffect(() => {
        localStorage.setItem('page', JSON.stringify(1))
        localStorage.setItem('filterPage', JSON.stringify(1))
        localStorage.setItem('filterSubmitted', JSON.stringify(false))
    }, [])

    return (
        <div>
            <NavBar home={home}></NavBar>
            <div className='container'>
                <div className='home-container'>
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <br></br>
                    <button onClick={() => navigate('/entries')}>View entries</button>
                    <br></br>
                    <button onClick={() => navigate('/new-entry')}>Create new entry</button>
                </div>
            </div>
        </div>
    )
}