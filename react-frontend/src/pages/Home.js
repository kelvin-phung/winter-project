import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function Home() {
    let navigate = useNavigate()
    return (
        <div>
            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
            <br></br>
            <button onClick={() => navigate('/entries')}>View entries</button>
            <br></br>
            <button onClick={() => navigate('/new-entry')}>Create new entry</button>
        </div>
    )
}