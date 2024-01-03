import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterForm from '../components/FilterForm';

export default function ViewEntries() {
    const url = "http://127.0.0.1:8000/entries/"
    const delete_url = "http://127.0.0.1:8000/delete-entry/"
    let navigate = useNavigate()
    const [entries, setEntries] = useState([])
    const [openFilterForm, setOpenFilterForm] = useState(false)
    const [delSuccess, setDelSuccess] = useState(0)
    const [forceRender, setForceRender] = useState(true)

    useEffect(() => {
        console.log('useEffect is running')
        Axios.get(url)
        .then(response => {
            setEntries(response.data['entries'])
        })
    }, [forceRender])

    useEffect(() => {
        if(delSuccess === 1){
            console.log('Delete was successful!')
            setForceRender(!(forceRender))
        }
    }, [delSuccess])

    function deleteEntry(id) {
        Axios.get(delete_url + id)
        .then(response => {
            setDelSuccess(response.data['delete'])
        })
    }

    function filterSubmit(entries) {
        setEntries(entries)
    }

    return (
        <div>
            {entries ?
            <ul>
                {/* Filter form */}
                <button onClick={() => setOpenFilterForm(true)}>Filter</button>
                <FilterForm open={openFilterForm} onClose={() => setOpenFilterForm(false)}
                filterSubmit={filterSubmit} forceRender={() => setForceRender(!(forceRender))}></FilterForm>
                {/* Entries */}
                {entries.map((entry) => <li>{entry.slice(1).map((field) => <span>{field} </span>)}
                <button onClick={() => navigate(`/edit-entry/${entry[0]}`)}>Edit</button>
                <button onClick={() => deleteEntry(entry[0])}>Delete</button>
                </li>)}
            </ul> : <p>no entries luv.</p>}
        </div>
    )
}