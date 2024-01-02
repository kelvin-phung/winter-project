import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewEntries() {
    const url = "http://127.0.0.1:8000/entries/"
    let navigate = useNavigate()
    const [entries, setEntries] = useState([])

    useEffect(() => {
        console.log('useEffect is running')
        Axios.get(url)
        .then(response => {
            setEntries(response.data['entries'])
        })
    }, [])

    return (
        <div>
            {entries ?
            <ul>
                {entries.map((entry) => <li>{entry.slice(1).map((field) => <span>{field} </span>)}
                <button onClick={() => navigate(`/edit-entry/${entry[0]}`)}>Edit</button></li>)}
            </ul> : <p>no entries luv.</p>}
        </div>
    )
}