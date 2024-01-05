import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterForm from '../components/FilterForm';
import useLocalStorage from '../components/useLocalStorage';

export default function ViewEntries() {
    const url = "http://127.0.0.1:8000/entries/"
    const delete_url = "http://127.0.0.1:8000/delete-entry/"
    let navigate = useNavigate()
    const [entries, setEntries] = useState([])
    const [currPage, setCurrPage] = useLocalStorage('page', 1)
    const [maxPage, setMaxPage] = useState(1)
    const [openFilterForm, setOpenFilterForm] = useState(false)
    const [filterSubmitted, setFilterSubmitted] = useState(false)
    const [filterPage, setFilterPage] = useLocalStorage('filterPage', 1)
    const [delSuccess, setDelSuccess] = useState(0)
    const [forceRender, setForceRender] = useState(true)

    useEffect(() => {
        console.log('useEffect is running')
        console.log(currPage)
        Axios.get(url + "?page=" + currPage)
        .then(response => {
            setEntries(response.data['entries'])
            setMaxPage(response.data['max_page'])
        })
    }, [forceRender, currPage])

    useEffect(() => {
        if(delSuccess === 1){
            console.log('Delete was successful!')
            if((currPage-1) * 10 + entries.length - 1 <= (maxPage-1)*10){
                console.log('grah')
                setCurrPage(currPage-1)
            }
            else{
                setForceRender(!(forceRender))
            }
        }
    }, [delSuccess])

    function deleteEntry(id) {
        Axios.get(delete_url + id)
        .then(response => {
            setDelSuccess(response.data['delete'])
        })
    }

    function showButton(button){
        if(button==='back'){
            if(!filterSubmitted){
                return (currPage !== 1)
            }
            else{
                return (filterPage !== 1)
            } 
        }
        else{
            if(!filterSubmitted){
                return (currPage !== maxPage)
            }
            else{
                return (filterPage !== maxPage)
            }
        }
    }

    function modifyCurrPage(button) {
        if(button==='back'){
            if(!filterSubmitted){
                return setCurrPage(currPage-1)
            }
            else{
                return setFilterPage(filterPage-1)
            } 
        }
        else{
            if(!filterSubmitted){
                return setCurrPage(currPage+1)
            }
            else{
                return setFilterPage(filterPage+1)
            }
        }
    }

    function filterSubmit(entries) {
        setEntries(entries)
        setFilterPage(1)
        setFilterSubmitted(true)
    }

    return (
        <div>
            {entries ?
            <ul>
                {/* Filter form */}
                <button onClick={() => setOpenFilterForm(true)}>Filter</button>
                <FilterForm open={openFilterForm} onClose={() => setOpenFilterForm(false)} setEntries={(entries) => setEntries(entries)}
                submitted={(value) => setFilterSubmitted(value)} filterPage={filterPage} filterSubmit={filterSubmit} filterCurrPage={modifyCurrPage}
                filterMaxPage={(page) => setMaxPage(page)} forceRender={() => setForceRender(!(forceRender))}></FilterForm>
                {/* Entries */}
                {entries.map((entry) => <li>{entry.slice(1).map((field) => <span>{field} </span>)}
                <button onClick={() => navigate(`/edit-entry/${entry[0]}`)}>Edit</button>
                <button onClick={() => deleteEntry(entry[0])}>Delete</button>
                </li>)}
                {/* Pages */}
                {showButton('back') ? <button onClick={() => modifyCurrPage('back')}>Back</button> : null}
                {!filterSubmitted ? currPage : filterPage}
                {showButton('next') ? <button onClick={() => modifyCurrPage('next')}>Next</button> : null}
            </ul> : <p>no entries luv.</p>}
        </div>
    )
}